// I Made This App Just To Help Me Memorize The Periodic Table Elements
document.addEventListener("DOMContentLoaded", () => {
  function getData(url: string): Promise<any> {
    return fetch(url).then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    });
  }

  // Elements Page
  const list = document.querySelector(
    ".page main .elements"
  ) as HTMLDivElement | null;

  if (list) {
    getData("data/elements.json").then((data) => {
      for (let i = 0; i < data.elements.length; i++) {
        let elementCard = document.createElement("div");
        elementCard.className = "element";
        list.appendChild(elementCard);

        let elementName = document.createElement("span");
        elementName.className = "name";
        elementName.textContent = data.elements[i].name;
        elementCard.appendChild(elementName);

        let elementSymbol = document.createElement("span");
        elementSymbol.className = "symbol";
        elementSymbol.textContent = data.elements[i].symbol;
        elementCard.appendChild(elementSymbol);

        let info = document.createElement("div");
        info.className = "info";
        elementCard.appendChild(info);

        let atomicNumber = document.createElement("span");
        atomicNumber.textContent = `Atomic Number: ${data.elements[i].number}`;
        info.appendChild(atomicNumber);

        let atomicMass = document.createElement("span");
        atomicMass.textContent = `Atomic Mass: ${Math.round(
          data.elements[i].atomic_mass
        )}`;
        info.appendChild(atomicMass);

        let period = document.createElement("span");
        period.textContent = `Period: ${data.elements[i].period}`;
        info.appendChild(period);

        let group = document.createElement("span");
        if (data.elements[i].group < 3) {
          group.textContent = `Group: ${data.elements[i].group}A`;
        } else if (data.elements[i].group > 12 && data.elements[i].group < 18) {
          group.textContent = `Group: ${data.elements[i].group - 10}A`;
        } else if (data.elements[i].group === 18) {
          group.textContent = `Group: 18 or 0`;
        } else {
          if (data.elements[i].group < 8) {
            group.textContent = `Group: ${data.elements[i].group}B`;
          } else if (data.elements[i].group >= 8 && data.elements[i].group <= 10) {
            group.textContent = `Group: 8B`;
          } else {
            group.textContent = data.elements[i].group === 11 
            ? `Group: 1B` : `Group: 2B`;
          }
        }
        info.appendChild(group);
      }
    });
  }

  // User Should Only Type Numbers And It Should Be Less Than Or Equal To 119
  const setNumberInput = document.querySelector(
    ".page main .settings .number .set input"
  ) as HTMLInputElement | null;

  const setBtn = document.querySelector(
    ".page main .settings .number .set button"
  ) as HTMLButtonElement | null;
  
  let SAVE: number = Number(window.localStorage.getItem("save")) || 40;

  if (setNumberInput) {
    setNumberInput.value = window.localStorage.getItem("save") || "40";
  }

  if (setNumberInput) {
    setNumberInput.addEventListener("input", () => {
      setNumberInput.value = setNumberInput.value.replace(/\D/, "");
      if (Number(setNumberInput.value) > 119) {
        setNumberInput.value = "119";
      } else if (Number(setNumberInput.value) <= 0) {
        setNumberInput.value = "1";
      }
    });
  }
  
  setBtn?.addEventListener("click", () => {
    if (setNumberInput) {
      SAVE = Number(setNumberInput.value);
      window.localStorage.setItem("save", setNumberInput.value);
    }
  });

  // Questions Page
  const atomicNumberQuestion = document.querySelector(
    ".page main .questions .question.atomic-number .symbol"
  ) as HTMLSpanElement | null;
  const elementFromNumberQuestion = document.querySelector(
    ".page main .questions .question.element-from-number .number"
  ) as HTMLSpanElement | null;
  const atomicNumberAnswer = document.querySelector(
    ".page main .questions .question.atomic-number input"
  ) as HTMLInputElement | null;
  const elementFromNumberAnswer = document.querySelector(
    ".page main .questions .question.element-from-number input"
  ) as HTMLInputElement | null;
  const submitBtn = document.querySelector(
    ".page main button"
  ) as HTMLButtonElement | null;
  const atomicNumberResult = document.querySelector(
    ".page main .questions .cont p.atomic-number-result"
  );
  const elementFromNumberResult = document.querySelector(
    ".page main .questions .cont p.element-from-number-result"
  );

  if (!SAVE) {

  }
  let randomAtomicNumber: number = Math.floor(Math.random() * SAVE) + 1;
  let randomAtomicElement: number = Math.floor(Math.random() * SAVE) + 1;

  if (elementFromNumberQuestion) {
    elementFromNumberQuestion.textContent = `${randomAtomicNumber}`;
  }

  if (atomicNumberQuestion) {
    getData("data/elements.json").then((data) => {
      atomicNumberQuestion.textContent = `${
        data.elements[randomAtomicElement - 1].symbol
      }`;
    });
  }

  function changeQuestion(type: "atomicNumber" | "elementFromNumber"): void {
    if (type === "atomicNumber" && atomicNumberQuestion) {
      randomAtomicElement = Math.floor(Math.random() * SAVE) + 1;
      getData("data/elements.json").then((data) => {
        atomicNumberQuestion.textContent = `${
          data.elements[randomAtomicElement - 1].symbol
        }`;
      });
    } else if (type === "elementFromNumber" && elementFromNumberQuestion) {
      randomAtomicNumber = Math.floor(Math.random() * SAVE) + 1;
      elementFromNumberQuestion.textContent = `${randomAtomicNumber}`;
    }
  }

  if (
    submitBtn &&
    atomicNumberAnswer &&
    elementFromNumberAnswer &&
    atomicNumberResult &&
    elementFromNumberResult
  ) {
    submitBtn.addEventListener("click", () => {
      getData("data/elements.json").then((data) => {
        // Check for atomic number question (user should enter the atomic number for the symbol)
        if (
          atomicNumberAnswer.value ===
          String(data.elements[randomAtomicElement - 1].number)
        ) {
          const correct = atomicNumberResult.children[0] as HTMLSpanElement;
          const incorrect = atomicNumberResult.children[1] as HTMLSpanElement;
          correct.style.display = "block";
          incorrect.style.display = "none";
          changeQuestion("atomicNumber");
        } else {
          const correct = atomicNumberResult.children[0] as HTMLSpanElement;
          const incorrect = atomicNumberResult.children[1] as HTMLSpanElement;
          correct.style.display = "none";
          incorrect.style.display = "block";
        }

        // Check for element from number question (user should enter the symbol for the atomic number)
        if (
          elementFromNumberAnswer.value.trim().toLowerCase() ===
          data.elements[randomAtomicNumber - 1].symbol.toLowerCase()
        ) {
          const correct = elementFromNumberResult
            .children[0] as HTMLSpanElement;
          const incorrect = elementFromNumberResult
            .children[1] as HTMLSpanElement;
          correct.style.display = "block";
          incorrect.style.display = "none";
          changeQuestion("elementFromNumber");
        } else {
          const correct = elementFromNumberResult
            .children[0] as HTMLSpanElement;
          const incorrect = elementFromNumberResult
            .children[1] as HTMLSpanElement;
          correct.style.display = "none";
          incorrect.style.display = "block";
        }
      });
    });
  }
});
