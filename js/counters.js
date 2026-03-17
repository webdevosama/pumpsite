// Quick counters logic for your script file
export function initCounters() {
  const counters = document.querySelectorAll(".counter");
  counters.forEach((counter) => {
    const target = +counter.getAttribute("data-target");
    const count = +counter.innerText;
    const increment = target / 200; // Adjust speed here

    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(initCounters, 1);
    } else {
      counter.innerText = target;
    }
  });
}
