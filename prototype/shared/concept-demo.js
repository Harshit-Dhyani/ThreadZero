(function () {
  const announce = (region, message) => {
    region.textContent = "";
    requestAnimationFrame(() => { region.textContent = message; });
  };

  document.querySelectorAll("[data-concept]").forEach((root) => {
    const live = root.querySelector("[data-live-region]");
    const confirmButton = root.querySelector("[data-confirm-extraction]");
    const attachButton = root.querySelector("[data-attach-evidence]");
    const resetButton = root.querySelector("[data-reset-demo]");
    const extractionState = root.querySelector("[data-extraction-state]");
    const evidenceState = root.querySelector("[data-evidence-state]");
    const attachedProofs = [...root.querySelectorAll("[data-attached-proof]")];
    const target = root.querySelector("[data-event-target]");

    const reset = () => {
      root.dataset.phase = "ready";
      confirmButton.disabled = false;
      confirmButton.textContent = "Confirm four payment details";
      attachButton.disabled = true;
      attachButton.textContent = "Attach to the 18:42 payment event";
      resetButton.hidden = true;
      extractionState.textContent = "Not yet checked";
      evidenceState.textContent = "Ready";
      attachedProofs.forEach((proof) => { proof.hidden = true; });
    };

    confirmButton.addEventListener("click", () => {
      root.dataset.phase = "confirmed";
      confirmButton.disabled = true;
      confirmButton.textContent = "Four details confirmed";
      attachButton.disabled = false;
      resetButton.hidden = false;
      extractionState.textContent = "Checked";
      evidenceState.textContent = "Confirmed";
      announce(live, "Four synthetic payment details confirmed. The evidence can now be attached to the 18:42 payment event.");
    });

    attachButton.addEventListener("click", () => {
      root.dataset.phase = "attached";
      attachButton.disabled = true;
      attachButton.textContent = "Attached to 18:42 event";
      evidenceState.textContent = "Attached";
      attachedProofs.forEach((proof) => { proof.hidden = false; });
      target?.focus();
      announce(live, "Transaction screenshot attached to the 18:42 UPI payment event.");
    });

    resetButton.addEventListener("click", () => {
      reset();
      confirmButton.focus();
      announce(live, "Evidence demonstration reset.");
    });

    reset();
  });
}());
