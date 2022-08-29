import { Subject } from "rxjs";
import { initLoginPage } from "../logic/loginLogic";
import { User } from "../models/user";

export function drawLoginPage(router: Subject<[number, User | null]>) {
  document.body.innerHTML = "";

  const loginContainer: HTMLElement = document.createElement("div");
  loginContainer.className = "loginContainer";

  const loginTitle: HTMLElement = document.createElement("label");
  loginTitle.textContent = "Login to play!";
  loginTitle.className = "title";
  loginContainer.appendChild(loginTitle);

  loginContainer.appendChild(drawEmailInput());

  loginContainer.appendChild(drawPasswordInput());

  const errorLabel: HTMLElement = document.createElement("label");
  errorLabel.id = "errorLabel";
  errorLabel.className = "errorLabel";
  errorLabel.textContent = "Wrong email and/or password!";
  loginContainer.appendChild(errorLabel);

  const loginButton: HTMLElement = document.createElement("button");
  loginButton.textContent = "Login";
  loginButton.className = "loginButton";
  loginButton.id = "loginButton";
  loginContainer.appendChild(loginButton);

  document.body.appendChild(loginContainer);

  initLoginPage(router);
}

function drawEmailInput(): HTMLElement {
  const emailDiv: HTMLElement = document.createElement("div");
  emailDiv.className = "loginInputDiv";

  const emailInput: HTMLElement = document.createElement("input");
  emailInput.setAttribute("type", "email");
  emailInput.className = "loginInput";
  emailInput.id = "emailInput";
  emailDiv.appendChild(emailInput);

  const emailLabel: HTMLElement = document.createElement("label");
  emailLabel.textContent = "Email";
  emailLabel.className = "loginLabel";
  emailDiv.appendChild(emailLabel);

  return emailDiv;
}

function drawPasswordInput(): HTMLElement {
  const passwordDiv: HTMLElement = document.createElement("div");
  passwordDiv.className = "loginInputDiv";

  const passwordInput: HTMLElement = document.createElement("input");
  passwordInput.setAttribute("type", "password");
  passwordInput.className = "loginInput";
  passwordInput.id = "passwordInput";
  passwordDiv.appendChild(passwordInput);

  const passwordLabel: HTMLElement = document.createElement("label");
  passwordLabel.textContent = "Password";
  passwordLabel.className = "loginLabel";
  passwordDiv.appendChild(passwordLabel);

  return passwordDiv;
}
