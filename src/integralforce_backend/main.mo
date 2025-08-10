// This file is part of the Integral Force backend.
// It contains the main actor that handles greetings, counting, and LLM interactions.
// The code is written in Motoko, a programming language for the Internet Computer.

import LLM "mo:llm";
import Nat64 "mo:base/Nat64";
import Text "mo:base/Text";
import Debug "mo:base/Debug";

// this actor or actor class should be declared `persistent`
// actor {
persistent actor{

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

  // LLM functions
  public func prompt(prompt : Text) : async Text {
      await LLM.prompt(#Llama3_1_8B, prompt);
  };

  public func chat(messages : [LLM.ChatMessage]) : async Text {
      let response = await LLM.chat(#Llama3_1_8B).withMessages(messages).send();

      switch (response.message.content) {
          case (?text) text;
          case null "";
      };
  };

  public func example() {
      let response = await LLM.chat(#Llama3_1_8B)
        .withMessages([
          #system_ {
            content = "You are a helpful assistant."
          },
          #user {
            content = "What's the weather in San Francisco?"
          },
        ])
        .withTools([LLM.tool("get_weather")
          .withDescription("Get current weather for a location")
          .withParameter(
            LLM.parameter("location", #String)
              .withDescription("The location to get weather for")
              .isRequired()
          )
          .build()
        ])
        .send();

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



  stable var currentQuestion : Text = "";
  stable var correctAnswer : Text = "";

  public func generateQuestion(topic: Text) : async Text {
      let input = "Create one essay question about \"" # topic # "\" without any introductory text, just display the question itself.";
      let response = await LLM.prompt(#Llama3_1_8B, input);
      
      currentQuestion := response;
      correctAnswer := "The correct answer";
      return response;
  };

  public func evaluateAnswer(userAnswer: Text) : async Text 
  {
      // let messages = [
      //     {
      //         role = #system_;
      //         content = "You are a helpful assistant.";
      //     },
      //     {
      //         role = #user;
      //         content = "Is the answer '" # userAnswer # "' correct for the question '" # currentQuestion # "'?";
      //     }
      // ];
      
      // let response = await LLM.chat(#Llama3_1_8B, messages);
      // return response;

      let messages = [
          #system_ {
              content = "You are a helpful assistant."
          },
          #user {
              content = "Is the answer '" # userAnswer # "' correct for the question '" # currentQuestion # "'?"
          }
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


};
