document.addEventListener("DOMContentLoaded", function () {
    const name = document.querySelector('#name'),
        lastName = document.querySelector('#lastname'),
        email = document.querySelector('#email'),
        password = document.querySelector('#password'),
        submit = document.querySelector('.submit'),
        error_output = document.querySelector('.output-error');

    const url = 'http://localhost:3000/api/newUserSaveRouter';
    submit.addEventListener('click', authorization);

    async function authorization(e) {
        e.preventDefault();

        await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                name: name.value,
                lastName: lastName.value,
                email: email.value,
                password: password.value
            })
        })
            .then(res => {
                console.log(res);
                if (res.status == 404)
                    return 404;
                if (res.status == 400)
                    return 400;
                if (res.status == 200)
                    return res.json()
            })
            .then(body => {
                if (body == 404) {
                    error_output.textContent = `Form data is incorrect `;
                }
                if (body == 400) {
                    error_output.textContent = `email or password already exists`;
                }
                if (body && body != 404 && body != 400) {
                    localStorage.setItem('token', body);
                    window.location.assign('./index.html')
                }
            })
            .catch(err => console.log(err.message));
    }

})