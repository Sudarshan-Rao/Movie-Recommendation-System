import hashlib
import logging

dict = {}


def signup_service(email, password):
    if email in dict.keys():
        print("email already exists")
        return -1
    hash_password = hashlib.sha256(password.encode())
    dict[email] = hash_password.hexdigest()
    return 1


def login_service(email, password):
    if email not in dict.keys():
        print("email does not exist!")
        return 0
    else:
        stored_password = dict[email]
        pass_id = hashlib.sha256(password.encode())
        if stored_password == pass_id.hexdigest():
            print("Login Successful")
            return 1
        else:
            print("Invalid password")
            return -1


if __name__ == '__main__':
    signup_service("sachin@gmail.com", "password123")
    login_service("sachin@gmail.com", "password123")
    print(dict)
