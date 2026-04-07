### Application Code ###

import random

def get_player_choice():
    choice = input('Enter your choice (rock, paper, scissors): ')
    while choice not in ['rock', 'paper', 'scissors']:
        choice = input('Please enter either rock, paper, or scissors: ')
    return choice


def compare_choices(player_choice):
    computer_choice = random.choice(['rock', 'paper', 'scissors'])

    if player_choice == 'rock':
        if computer_choice == 'paper':
            winner = 'Computer'
        elif computer_choice == 'scissors':
            winner = 'Player'
        else:
            winner = 'Tie'
    elif player_choice == 'paper':
        if computer_choice == 'rock':
            winner = 'Player'
        elif computer_choice == 'scissors':
            winner = 'Computer'
        else:
            winner = 'Tie'
    elif player_choice == 'scissors':
        if computer_choice == 'rock':
            winner = 'Computer'
        elif computer_choice == 'paper':
            winner = 'Player'
        else:
            winner = 'Tie'

    return 'Player chose ' + player_choice + '. The computer chose ' + computer_choice + '. The winner is ' + winner + '!\n'


### Automated Test Code ###

# 1️⃣ Arrange


# 2️⃣ Act


# 3️⃣ Assert

