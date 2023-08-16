class Login {
    constructor(form, fields) {
        this.form = form;
        this.fields = fields;
        this.validateonSubmit();
    }

    async getOrdenes(token){
        //const API_URL = "http://192.168.1.3:8080/api/v1";
        //const API_URL = "http://192.168.68.107:8080/api/v1";
        const API_URL = "https://apitest-jv3s.onrender.com/api/v1";
        try {
        const response = await
            fetch(`${API_URL}/order`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "auth-token": token,
            },
            method: 'GET',
        });

        const resData = await response.json();

        //console.log("ordenes ", resData);

        if(resData.status == "OK"){
            return resData.content;
        }else{
            return [];
        }

        return resData;

        } catch (err) {
            throw err;
        }
    }

    async getProductos(token){
        //const API_URL = "http://192.168.1.3:8080/api/v1";
        //const API_URL = "http://192.168.68.107:8080/api/v1";
        const API_URL = "https://apitest-jv3s.onrender.com/api/v1";
        try {
        const response = await
            fetch(`${API_URL}/product`, {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                "auth-token": token,
            },
            method: 'GET',
        });

        const resData = await response.json();

        //console.log("productos ", resData);

        return resData.content.rows;

        } catch (err) {
            throw err;
        }
    }

    validateonSubmit() {
        let self = this; // setup calls to the "this" values of the class described in the constructor
    
        // add a "submit" event listener to the form
        this.form.addEventListener("submit", (e) => {
            // remove default functionality 
            e.preventDefault();
            var error = 0;
            var email;
            var password;
            // loop through the fields and check them against a function for validation
            self.fields.forEach((field) => {
                const input = document.querySelector(`#${field}`);

                if(field == "email"){
                    email = document.querySelector(`#${field}`).value;
                }else{
                    password = document.querySelector(`#${field}`).value;
                }

                if (self.validateFields(input) == false) {
                    // if a field does not validate, auto-increment our error integer
                    error++;
                }
            });
            // if everything validates, error will be 0 and can continue
            if (error == 0) {
                async function login(){
                    //const API_URL = "http://192.168.1.3:8080/api/v1";
                    //const API_URL = "http://192.168.68.107:8080/api/v1";
                    const API_URL = "https://apitest-jv3s.onrender.com/api/v1";
                    try {
                    const response = await
                        fetch(`${API_URL}/user/login`, {
                        headers: {
                            Accept: 'application/json',
                            'Content-Type': 'application/json',
                        },
                        method: 'POST',
                        body: JSON.stringify({
                            email,
                            password,
                            pushTokens: [],
                        }),
                    });

                    const resData = await response.json();

                    return resData;

                    } catch (err) {
                        throw err;
                    }
                }

                const rty = login().then((res_log)=>{
                    if(!res_log.err){
                        localStorage.setItem("auth", 1);
                        localStorage.setItem("user_info", JSON.stringify(res_log));
                        //this.getOrdenes(res_log.token);
                        //localStorage.setItem("ordenes", JSON.stringify(this.getOrdenes(res_log.token).then()));
                        this.getOrdenes(res_log.token).then((ordenes_val)=>{
                            localStorage.setItem("ordenes", JSON.stringify(ordenes_val));
                        });   
                        
                        this.getProductos(res_log.token).then((productos_val)=>{
                            localStorage.setItem("productos", JSON.stringify(productos_val));
                            this.form.submit();
                        });  
                    }else{
                        alert(res_log.err);
                        this.form.submit();
                    }
                });

                //this.form.submit();
            }
        });
    }

    validateFields(field) {
        // remove any whitespace and check to see if the field is blank, if so return false
        if (field.value.trim() === "") {
            // set the status based on the field, the field label, and if it is an error message
            this.setStatus(
                field,
                `${field.previousElementSibling.innerText} no puede estar en blanco`,
                "error"
            );
            return false;
        } else {
            // if the field is not blank, check to see if it is password
            if (field.type == "password") {
                // if it is a password, check to see if it meets our minimum character requirement
                if (field.value.length < 8) {
                    // set the status based on the field, the field label, and if it is an error message
                    this.setStatus(
                        field,
                        `${field.previousElementSibling.innerText} debe tener al menos 8 caracteres`,
                        "error"
                    );
                    return false;
                } else {
                    // set the status based on the field without text and return a success message
                    this.setStatus(field, null, "success");
                    return true;
                }
            } else {
                // set the status based on the field without text and return a success message
                this.setStatus(field, null, "success");
                return true;
            }
        }
    }

    setStatus(field, message, status) {
        // create variable to hold message
        const errorMessage = field.parentElement.querySelector(".error-message");

        // if success, remove messages and error classes
        if (status == "success") {
            if (errorMessage) {
                errorMessage.innerText = "";
            }
            field.classList.remove("input-error");
        }
        // if error, add messages and add error classes
        if (status == "error") {
            errorMessage.innerText = message;
            field.classList.add("input-error");
        }
    }


}