document.addEventListener("DOMContentLoaded", function () {
    const email = document.querySelector('#emailLog'),
        password = document.querySelector('#passwordLog'),
        btnLog = document.querySelector('.btnLog'),
        error_output = document.querySelector('.output-error');

    const url = 'http://localhost:3000/api/authRouter/login';
    btnLog.addEventListener('click', loginUser);

    async function loginUser(e) {
        e.preventDefault();
        await fetch(url, {
            method: 'POST',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email.value,
                password: password.value
            })
        })
            .then(res => {
                if (res.status == 404)
                    return 404;
                if (res.status == 400)
                    return 400;
                if (res.status == 200)
                    return res.json()
            })
            .then(body => {
                if (body == 404) {
                    error_output.textContent = 'Login or Password is invalid';
                } else
                    if (body == 400) {
                        error_output.textContent = 'Login or Password is incorrect';
                    } else
                        if (body) {
                            localStorage.setItem('token', body);
                            window.location.assign('./index.html')
                        }
            })
            .catch(err => console.log(err.message));
    }

})