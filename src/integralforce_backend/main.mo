// This file is part of the Integral Force backend.
// It contains the main actor that handles greetings, counting, and LLM interactions.
// The code is written in Motoko, a programming language for the Internet Computer.

import LLM "mo:llm";
import Nat64 "mo:base/Nat64";
import Text "mo:base/Text";
import Debug "mo:base/Debug";
import Principal "mo:base/Principal";
import Cycles "mo:base/ExperimentalCycles";
import Nat "mo:base/Nat";

// persistent actor Whoami {
//   public query (message) func whoami() : async Principal {
//     message.caller;
//   };
// };

// this actor or actor class should be declared `persistent`
// actor {
persistent actor {

  // Counter variable to keep track of count
  private stable var counter : Nat64 = 0;

  // Greeting function that the frontend uses
  public query func greet(name : Text) : async Text {
    return "Hello, " # name # "!";
  };

  // Get the current counter value
  public query func get_count() : async Nat64 {
    return counter;
  };

  // Increment the counter and return the new value
  public func increment() : async Nat64 {
    counter += 1;
    return counter;
  };

  // Set the counter to a specific value
  public func set_count(value : Nat64) : async Nat64 {
    counter := value;
    return counter;
  };

  // LLM function to chat with a prompt
  public func chat(prompt : Text) : async Text {
    let messages : [LLM.ChatMessage] = [
      #system_ {
        content = "You are a helpful assistant.";
      },
      #user {
        content = prompt;
      },
    ];
    // Send the chat request with the messages
    let response = await LLM.chat(#Llama3_1_8B).withMessages(messages).send();

    // Process the response
    // Return the content of the response message
    switch (response.message.content) {
      case (?text) text;
      case null "";
    };
  };

  // This work in the canister terminal
  public func example() {
    let response = await LLM.chat(#Llama3_1_8B).withMessages([
      #system_ {
        content = "You are a helpful assistant.";
      },
      #user {
        content = "What's the weather in San Francisco?";
      },
    ]).withTools([
      LLM.tool("get_weather").withDescription("Get current weather for a location").withParameter(
        LLM.parameter("location", #String).withDescription("The location to get weather for").isRequired()
      ).build()
    ]).send();

    switch (response.message.content) {
      case (?text) {
        // Process the text response
        Debug.print(text);
      };
      case null {
        // Handle null response
        Debug.print("No content returned");
      };
    };
  };

  // Variables to store the current question and correct answer
  stable var currentQuestion : Text = "";
  stable var correctAnswer : Text = "";

  // Function to generate a question based on a topic
  public func generateQuestion(topic : Text) : async Text {
    let input = "Create one essay question about \"" # topic # "\" without any introductory text, just display the question itself.";
    let response = await LLM.prompt(#Llama3_1_8B, input);

    currentQuestion := response;
    correctAnswer := "The correct answer";
    return response;
  };

  // Function to evaluate the user's answer
  public func evaluateAnswer(userAnswer : Text) : async Text {
    // Ensure the current question is set
    let messages = [
      #system_ {
        content = "You are a helpful assistant.";
      },
      #user {
        content = "Is the answer '" # userAnswer # "' correct for the question '" # currentQuestion # "'?";
      },
    ];
    // Send the chat request with the messages
    let response = await LLM.chat(#Llama3_1_8B).withMessages(messages).send();

    // Process the response
    // Return the content of the response message
    switch (response.message.content) {
      case (?text) text;
      case null "";
    };
  };

  public query (message) func greetCaller() : async Text {
    return "Hello, " # Principal.toText(message.caller) # "!";
  };

   public query (message) func whoami() : async Principal {
    return message.caller;
  };


  // Return the principal identifier of this canister via the optional `this` binding.
  // This is much quicker than `id()` above, since it avoids the latency of `await whoami()`.
  public func idQuick() : async  (Nat, Nat) {
    let before = Cycles.balance();
    Debug.print("Cycles before: " # Nat.toText(before));
    let after = Cycles.balance();
    return (before, after);
  };  

};
