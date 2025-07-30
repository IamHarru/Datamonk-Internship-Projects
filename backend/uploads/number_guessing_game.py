import random
import pyttsx3
engine = pyttsx3.init()
number_to_guess= random.randint(1,100)
guess= None 
attempts = 0 


print("Welcom to the Number Guessing Game ! ")
engine.say("Welcom to the Number Guessing Game ! ")
engine.runAndWait()
print("I'm thinking of a number between 1 and 100.")
engine.say("I'm thinking of a number between 1 and 100.")
engine.runAndWait()
while guess != number_to_guess:
    prompt = "Enter the number: "
    engine.say(prompt)
    engine.runAndWait()
    guess=int(input(prompt))
    attempts +=1
    if guess < number_to_guess >100 :
        print("To low! Try again:") 
        engine.say("To low! Try again.")
        engine.runAndWait()
    elif guess > number_to_guess :
        print("To High ! Try again:") 
        engine.say("To Highh! Try again:")
        engine.runAndWait()
    else :
          print (f"Congratulation! you guessed it in {attempts} tries ")
          engine.say(f"Congratulation! you guessed it in {attempts} tries.")
          engine.runAndWait()