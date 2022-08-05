import { initLoginPage } from "../logic/loginLogic";

export function drawLoginPage() {
  document.body.innerHTML = "";

  let loginContainer = document.createElement("div");
  loginContainer.className = "loginContainer";

  let loginTitle = document.createElement("label");
  loginTitle.textContent = "Login to play!";
  loginTitle.className = "title";
  loginContainer.appendChild(loginTitle);

  loginContainer.appendChild(drawEmailInput());

  loginContainer.appendChild(drawPasswordInput());

  let errorLabel = document.createElement("label");
  errorLabel.id = "errorLabel";
  errorLabel.className = "errorLabel";
  errorLabel.textContent = "Wrong email and/or password!";
  loginContainer.appendChild(errorLabel);

  let loginButton = document.createElement("button");
  loginButton.textContent = "Login";
  loginButton.className = "loginButton";
  loginButton.id = "loginButton";
  loginContainer.appendChild(loginButton);

  document.body.appendChild(loginContainer);

  initLoginPage();
}

function drawEmailInput(): HTMLElement {
  let emailDiv = document.createElement("div");
  emailDiv.className = "loginInputDiv";

  let emailInput = document.createElement("input");
  emailInput.setAttribute("type", "email");
  emailInput.className = "loginInput";
  emailInput.id = "loginInput";
  emailDiv.appendChild(emailInput);

  let emailLabel = document.createElement("label");
  emailLabel.textContent = "Email";
  emailLabel.className = "loginLabel";
  emailDiv.appendChild(emailLabel);

  return emailDiv;
}

function drawPasswordInput(): HTMLElement {
  let passwordDiv = document.createElement("div");
  passwordDiv.className = "loginInputDiv";

  let passwordInput = document.createElement("input");
  passwordInput.setAttribute("type", "password");
  passwordInput.className = "loginInput";
  passwordInput.id = "passwordInput";
  passwordDiv.appendChild(passwordInput);

  let passwordLabel = document.createElement("label");
  passwordLabel.textContent = "Password";
  passwordLabel.className = "loginLabel";
  passwordDiv.appendChild(passwordLabel);

  return passwordDiv;
}
