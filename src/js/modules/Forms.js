import TomSelect from "tom-select";
import "/node_modules/tom-select/dist/css/tom-select.default.css";

export class Forms {
  /** @type {{formNode: HTMLFormElement, inputs: NodeListOf<HTMLInputElement>, sumbitBtn: HTMLButtonElement}} */
  #forms = {};

  constructor() {
    const forms = document.querySelectorAll("FORM");
    forms.forEach((form) => {
      const formType = form.dataset.type;
      this.#forms[formType] = {};
      this.#forms[formType].formNode = form;
      this.#forms[formType].inputs = form.querySelectorAll("input");
      this.#forms[formType].selects = form.querySelectorAll("select");
      this.#forms[formType].sumbitBtn = form.querySelector(".form__submitBtn");
      this.#forms[formType].sumbitBtn.addEventListener(
        "click",
        this.#onFormSubmitClick.bind(this, formType)
      );

      this.#initSelects(this.#forms[formType]);
    });
  }

  #initSelects(form) {
    form.selects.forEach((el) => {
      new TomSelect(el, {
        create: false,
        sortField: {
          field: "text",
          direction: "asc",
        },
      });
    });
  }

  #onFormSubmitClick(formType) {
    const formObj = this.#forms[formType];
    if (!this.#validateInputs([...formObj.inputs, ...formObj.selects])) return;

    formObj.formNode.classList.add("sending");

    this.#sendForm(formType)
      .then(
        (res) => {
          formObj.formNode.parentElement.parentElement.classList.add("success");
        },
        (error) => {
          formObj.formNode.classList.add("error");
        }
      )
      .then((e) => {
        formObj.formNode.classList.remove("sending");
        formObj.formNode.reset();
      })
      .catch((e) => {
        console.error(e);
      });
  }

  #sendForm = async (formType) => {
    const formObj = this.#forms[formType];
    let data = this.#getFormData(formType);
    return new Promise((res) => {
      setTimeout(() => {
        res();
      }, 3000);
    });
    try {
      let res = await fetch("../files/sendmail.php");
      res = await res.json();
      console.log(res);
      return res;
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  #getFormData(formType) {
    const data = new FormData(this.#forms[formType].formNode);

    return data;
  }

  #validateInputs(inputs) {
    let _errors = 0;
    inputs.forEach((input) => {
      const validationTypes = input.dataset.validation
        ?.split(",")
        .map((el) => el.toLowerCase().trim());
      if (!validationTypes || validationTypes.length === 0) return;
      validationTypes.forEach((validationType) => {
        switch (validationType) {
          case "length":
            if (!this.#isLengthValid.call(input)) _errors += 1;
            break;
          case "email":
            if (!this.#isEmailValid.call(input)) _errors += 1;
            break;
          case "phone":
            if (!this.#isPhoneValid.call(input)) _errors += 1;
            break;
          case "linkedin":
            if (!this.#isLinkedinValid.call(input)) _errors += 1;
            break;
          case "file":
            if (!this.#isFileValid.call(input)) _errors += 1;
            break;
        }
      });
    });

    return _errors === 0 ? true : false;
  }

  #isFileValid() {
    const files = this.files;
    let _errors = 0;
    for (const file of files) {
      if (file.size > 10000000) {
        this.classList.toggle("error", true);
        _errors += 1; //max 10mb
      } else {
        this.classList.toggle("error", false);
      }
    }
    return _errors === 0 ? true : false;
  }

  #isLengthValid() {
    const value = this.value.trim();
    if (!value) {
      this.classList.toggle("empty", true);
      return false;
    } else {
      this.classList.toggle("empty", false);
      return true;
    }
  }

  #isPhoneValid() {
    const value = this.value.trim();
    if (!/^[0-9\+)(\-\/]+$/.test(value)) {
      this.classList.toggle("error", true);
      return false;
    } else {
      this.classList.toggle("error", false);
      return true;
    }
  }

  #isLinkedinValid() {
    const value = this.value.trim();
    if (
      !/^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)/gm.test(
        value
      )
    ) {
      this.classList.toggle("error", true);
      return false;
    } else {
      this.classList.toggle("error", false);
      return true;
    }
  }

  #isEmailValid() {
    const value = this.value.trim();
    const regExp =
      /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/g;
    if (!regExp.test(value)) {
      this.classList.toggle("error", true);
      return false;
    } else {
      this.classList.toggle("error", false);
      return true;
    }
  }

  #onFileInputChange(e, element) {
    const target = e.target;
    target.classList.remove("error");
    const fileName = target.files[0]?.name || "";
    element.textContent = fileName;
  }
}
