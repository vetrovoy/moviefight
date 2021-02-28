const createAutoComplete = ({
  root,
  renderOption,
  onOptionSelect,
  inputvalue,
  fetchData
}) => {
  root.innerHTML = `
        <label><b>Search</b></label>
        <input class="input" />
        <div class="dropdown">
            <div class="dropdown-menu">
            <div class="dropdown-content results"></div>
            </div>
        </div>
    `;

  const input = root.querySelector("input");
  const dropdown = root.querySelector(".dropdown");
  const resultsWrapper = root.querySelector(".results");

  const debounce = (callback, delay = 1000) => {
    let timeoutId;
    return (...args) => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      timeoutId = setTimeout(() => {
        callback.apply(null, args);
      }, delay);
    };
  };

  const onInput = debounce(async (event) => {
    const items = await fetchData(event.target.value);

    if (!items.length) {
      dropdown.classList.remove("is-active");
      return;
    }

    resultsWrapper.innerHTML = "";

    dropdown.classList.add("is-active");
    for (let item of items) {
      const option = document.createElement("a");
      const imgSrc = item.Poster === "N/A" ? "" : item.Poster;

      option.classList.add("dropdown-item");
      option.innerHTML = renderOption(item);
      resultsWrapper.appendChild(option);

      option.addEventListener("click", () => {
        dropdown.classList.remove("is-active");
        input.value = inputvalue(item);
        onOptionSelect(item);
      });
    }
  });

  input.addEventListener("input", onInput);

  document.addEventListener("click", (event) => {
    if (!root.contains(event.target)) {
      dropdown.classList.remove("is-active");
    }
  });
};
