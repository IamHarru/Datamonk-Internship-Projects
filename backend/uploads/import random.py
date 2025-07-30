import random
import pyttsx3
import speech_recognition as sr

number_to_guess = random.randint(1, 100)
guess = None
attempts = 0

print("Welcome to the Number Guessing Game!")
print("I'm thinking of a number between 1 and 100.")

recognizer = sr.Recognizer()
engine = pyttsx3.init()

while guess != number_to_guess:
    with sr.Microphone() as source:
        print("Say your guess:")
        audio = recognizer.listen(source)
        try:
            spoken_text = recognizer.recognize_google(audio)
            print(f"You said: {spoken_text}")
            guess = int(spoken_text)
        except Exception as e:
            print("Sorry, I didn't catch that. Please try again.")
            continue

    attempts += 1
    if guess < number_to_guess:
        print("Too low! Try again:")
        engine.say("Too low! Try again.")
        engine.runAndWait()
    elif guess > number_to_guess:
        print("Too high! Try again:")
        engine.say("Too high! Try again.")
        engine.runAndWait()
    else:
        print(f"Congratulations! You guessed it in {attempts} tries.")
        engine.say(f"Congratulations! You guessed it in {attempts} tries.")
        engine.runAndWait()p