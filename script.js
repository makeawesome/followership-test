document.addEventListener("DOMContentLoaded", () => {
  const questions = [
    "1. 나의 일은 나에게 중요한 사회적, 개인적 꿈을 성취하는 데 도움이 된다.",
    "2. 나의 과업 목표는 조직 최고의 목표와 부합한다.",
    "3. 최선의 아이디어와 능력을 일과 조직에 헌신하며 정력적으로 일한다.",
    "4. 나의 열의가 확산되어 동료 직원을 활기차게 만든다.",
    "5. 리더의 지시를 기다리기보다 조직의 가장 중요한 목표를 위해 직접 판단하고 행동한다.",
    "6. 리더와 조직에 가치있는 사람이 되기 위해 독특한 능력을 적극 발휘한다.",
    "7. 새로운 일이나 임무가 있을 때 리더가 중요한 의미라고 생각하는 업무에서 즉각 공적을 세운다.",
    "8. 기한 내에 일을 훌륭히 해낼 뿐 아니라 리더는 나를 믿고 어려운 임무를 맡긴다.",
    "9. 나의 업무를 벗어나는 일도 찾아서 성공적으로 완수하기 위해 솔선한다.",
    "10. 프로젝트 리더가 아닐 때도 맡은 일보다 많은 일을 하고 공헌한다.",
    "11. 리더나 조직 목표에 크게 공헌할 수 있는 새로운 아이디어를 독자적으로 고안해서 적극적으로 제기한다.",
    "12. 리더에게 의존해서 어려운 문제를 해결하기보다 스스로 해결한다.",
    "13. 아무런 인정을 받지 못할 때라도 다른 동료들에게 좋은 평가를 받도록 돕는다.",
    "14. 필요한 경우 일부러 반대 의견을 개진해서라도 리더와 구성원의 아이디어나 계획의 위험성을 볼 수 있게 돕는다.",
    "15. 리더의 요구나 목표, 제약을 이해하고 그것을 충족시키기 위해 열심히 일한다.",
    "16. 자신에 대한 평가를 미루기 보다는 장점과 약점을 적극적이고 솔직하게 인정한다.",
    "17. 지시받는 데서 벗어나 리더가 내린 판단이 옳은가를 스스로 평가한다.",
    "18. 리더가 나의 전문 분야나 개인적 흥미에 정면으로 배치되는 일을 해달라고 할 때 싫다고 한다.",
    "19. 리더나 집단의 기준이 아니라 자신의 윤리적 기준에 따라 행동하는가?",
    "20. 자신이 속한 집단과 갈등하거나 리더로부터 보복을 당한다 해도 중요한 이슈에 대해 나의 견해를 주장한다.",
  ];

  const independentIndices = [1, 5, 11, 12, 14, 16, 17, 18, 19, 20].map(
    (i) => i - 1,
  ); // 0-based index
  const activeIndices = [2, 3, 4, 6, 7, 8, 9, 10, 13, 15].map((i) => i - 1); // 0-based index

  const form = document.getElementById("test-form");
  const questionsContainer = document.getElementById("questions-container");
  const submitBtn = document.querySelector(".submit-btn");
  const resultSection = document.getElementById("result-section");
  const retryBtn = document.getElementById("retry-btn");
  const scoreYDisplay = document.getElementById("score-y");
  const scoreXDisplay = document.getElementById("score-x");
  const resultDot = document.getElementById("result-dot");

  // 1. Render Questions
  questions.forEach((q, index) => {
    const questionEl = document.createElement("div");
    questionEl.className = "question-item";
    questionEl.innerHTML = `
            <div class="question-text">${q}</div>
            <div class="options">
                ${[5, 4, 3, 2, 1]
                  .map((pool, i) => {
                    const label = [
                      "매우 그렇다",
                      "그렇다",
                      "보통이다",
                      "그렇지 않다",
                      "전혀 그렇지 않다",
                    ][i];
                    return `
                        <label class="option-label">
                            <input type="radio" name="q${index}" value="${pool}" required>
                            <span>${label} (${pool})</span>
                        </label>
                    `;
                  })
                  .join("")}
            </div>
        `;
    questionsContainer.appendChild(questionEl);
  });

  // 2. Handle Selection Styling & Submission Enable
  form.addEventListener("change", (e) => {
    if (e.target.type === "radio") {
      const parent = e.target.closest(".options");
      parent
        .querySelectorAll(".option-label")
        .forEach((label) => label.classList.remove("selected"));
      e.target.parentElement.classList.add("selected");

      checkAllAnswered();
    }
  });

  function checkAllAnswered() {
    const answeredCount = form.querySelectorAll("input:checked").length;
    if (answeredCount === questions.length) {
      submitBtn.disabled = false;
    }
  }

  // 3. Handle Submission
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    calculateAndShowResult();
  });

  function calculateAndShowResult() {
    const formData = new FormData(form);
    let activeScore = 0;
    let independentScore = 0;

    // Calculate scores
    for (let i = 0; i < questions.length; i++) {
      const val = parseInt(formData.get(`q${i}`));

      if (activeIndices.includes(i)) {
        activeScore += val;
      } else if (independentIndices.includes(i)) {
        independentScore += val;
      }
    }

    // Min score 10 (2 * 5 ? no, 10 questions * 1 point = 10), Max score 50 (10 * 5 = 50)
    // Ensure within bounds (just in case)
    activeScore = Math.max(10, Math.min(50, activeScore));
    independentScore = Math.max(10, Math.min(50, independentScore));

    // Update Text
    scoreXDisplay.textContent = activeScore;
    scoreYDisplay.textContent = independentScore;

    // Position Plot
    // Assuming the graph axes are 0 to 60 (based on typical 10-50 range, usually centered at 30)
    // Let's normalize 0-60 range to 0-100%
    // wait, the test says 10-50 range.
    // Let's assume standard graph where center is (30, 30).
    // Let's map min (0) to 0% and max (60) to 100% for better margin?
    // Actually, looking at image1 (usually), axes might start from 0.
    // Let's assume the visible area is roughly 0 to 60 for both axes to be safe,
    // effectively centering 30.

    // Let's try 0 to 60 scale first.
    const maxScale = 60;
    const xPercent = (activeScore / maxScale) * 100;
    const yPercent = 100 - (independentScore / maxScale) * 100; // Y axis is inverted in CSS logic (top is 0%)

    // Adjust for image margins if needed. For now, simple linear mapping.
    // If image1 has margins/labels, we might need offsets.
    // Since I can't see the image exactly coordinate-wise,
    // I will assume the image represents the cartesian plane 0-60.
    // And usually these charts have 30,30 at center.

    resultDot.style.left = `${xPercent}%`;
    resultDot.style.top = `${yPercent}%`;

    // Animation
    form.classList.add("hidden");
    resultSection.classList.remove("hidden");
    window.scrollTo(0, 0);
  }

  // 4. Retry
  retryBtn.addEventListener("click", () => {
    form.reset();
    document
      .querySelectorAll(".option-label")
      .forEach((l) => l.classList.remove("selected"));
    submitBtn.disabled = true;
    resultSection.classList.add("hidden");
    form.classList.remove("hidden");
    window.scrollTo(0, 0);
  });
});
