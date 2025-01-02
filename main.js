document.addEventListener('DOMContentLoaded', function() {
    const form = document.querySelector('form');
    const errorContainer = document.createElement('div');
    form.prepend(errorContainer);

    let loanAmount = 0;
    let numberOfPeriods = 0;
    let annualInterest = 0;
    let loanSchedule = [];

    document.querySelector("#resetAll").addEventListener('click', () => {
        document.querySelector('table').style.display = "none";
        form.style.display = "initial";
        form.reset();
        loanSchedule.splice(0, loanSchedule.length);
        document.querySelector("table tbody").innerHTML = ''; // Clear the table body content
    });


    form.addEventListener('submit', function(event) {
        event.preventDefault();
        errorContainer.innerHTML = ''; // Clear previous errors
        const errors = [];
        const inputs = form.querySelectorAll('input');

        inputs.forEach(input => {
            if (!input.value) {
                errors.push(`${input.name} is required`);
            }
        });

        if (errors.length > 0) {
            errors.forEach(error => {
                const errorDiv = document.createElement('div');
                errorDiv.classList.add('flash-message');
                errorDiv.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16">
                        <path d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14zm0 1A8 8 0 1 1 8 0a8 8 0 0 1 0 16z"/>
                        <path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zm.93-7.481a.5.5 0 0 1 .998 0l-.35 4.5a.25.25 0 0 1-.498 0l-.35-4.5z"/>
                    </svg>
                    <span>${error}</span>
                `;
                errorContainer.appendChild(errorDiv);
            });
        } else {
            // Add your form handling logic here
            loanAmount = parseFloat(document.querySelector("#loanAmount").value);
            annualInterest = parseFloat(document.querySelector("#interestRate").value);
            numberOfPeriods = parseInt(document.querySelector("#loanTerm").value);
            console.log(loanAmount, annualInterest, numberOfPeriods);
            console.log('Form submitted successfully.');

            constantPayments = loanAmount / ((1-((1+annualInterest)**(-numberOfPeriods)))/annualInterest);
            console.log(constantPayments);

            let n = 0;

            while (n<=numberOfPeriods){
                if (n==0) {
                    outstandingBal = loanAmount;
                    loanSchedule.push({OB: outstandingBal});
                    n +=1;
                } else {
                    previousOB = loanSchedule[n-1].OB;
                    interest = (previousOB * annualInterest).toFixed(2);
                    principalRepaid = (constantPayments - interest).toFixed(2);
                    outstandingBal =  (previousOB - principalRepaid).toFixed(2);
                    loanSchedule.push({I: interest, PR: principalRepaid, OB: outstandingBal});
                    n+=1;
                }
            }
            document.querySelector("form").style.display = "none";

            for (let i = 0; i < loanSchedule.length; i++) {
                document.querySelector("table tbody").insertAdjacentHTML('beforeend',
                    `<tr>
                        <td>${i}</td>
                        <td>${loanSchedule[i].OB} </td>
                        <td>${loanSchedule[i].PR ? loanSchedule[i].PR : null }</td>
                        <td>${loanSchedule[i].I ? loanSchedule[i].I : null}</td>
                    </tr>`
                );
            }

            document.querySelector("table").style.display = "block";
        }
    });
});
