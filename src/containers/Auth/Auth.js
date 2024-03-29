import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { Formik, Form, Field } from "formik";
import * as Yup from 'yup';

import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.css';
import * as actions from '../../store/actions/index';

class Auth extends Component {
    state = {
        // controls: {
        //     email: {
        //         elementType: 'input',
        //         elementConfig: {
        //             type: 'email',
        //             placeholder: 'Mail Address'
        //         },
        //         value: '',
        //         validation: {
        //             required: true,
        //             isEmail: true
        //         },
        //         valid: false,
        //         touched: false
        //     },
        //     password: {
        //         elementType: 'input',
        //         elementConfig: {
        //             type: 'password',
        //             placeholder: 'Password'
        //         },
        //         value: '',
        //         validation: {
        //             required: true,
        //             minLength: 6
        //         },
        //         valid: false,
        //         touched: false
        //     }
        // },
        isSignup: true
    }

    componentDidMount() {
        if (!this.props.buildingBurger && this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath();
        }
    }

    // checkValidity(value, rules) {
    //     let isValid = true;
    //     if (!rules) {
    //         return true;
    //     }

    //     if (rules.required) {
    //         isValid = value.trim() !== '' && isValid;
    //     }

    //     if (rules.minLength) {
    //         isValid = value.length >= rules.minLength && isValid
    //     }

    //     if (rules.maxLength) {
    //         isValid = value.length <= rules.maxLength && isValid
    //     }

    //     if (rules.isEmail) {
    //         const pattern = /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
    //         isValid = pattern.test(value) && isValid
    //     }

    //     if (rules.isNumeric) {
    //         const pattern = /^\d+$/;
    //         isValid = pattern.test(value) && isValid
    //     }

    //     return isValid;
    // }

    // inputChangedHandler = (event, controlName) => {
    //     const updatedControls = {
    //         ...this.state.controls,
    //         [controlName]: {
    //             ...this.state.controls[controlName],
    //             value: event.target.value,
    //             valid: this.checkValidity(event.target.value, this.state.controls[controlName].validation),
    //             touched: true
    //         }
    //     };
    //     this.setState({ controls: updatedControls });
    // }

    submitHandler = (values) => {
        // event.preventDefault();
        this.props.onAuth(values.email, values.password, this.state.isSignup);
    }

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return { isSignup: !prevState.isSignup };
        });
    }

    // validateEmail = (value) => {
    //     let error;
    //     if (!value) {
    //         error = "Required";
    //     } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
    //         error = "Invalid email address";
    //     }
    //     return error;
    // }

    // validatePassowrd = (value) => {
    //     let error;
    //     if (value.length < 6) {
    //         error = "password must be more than 6";
    //     }
    //     return error;
    // }

    render() {
        const formElementsArray = [];
        for (let key in this.state.controls) {
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
            });
        }

        // let form = formElementsArray.map(formElement => (
        //     <Input
        //         key={formElement.id}
        //         elementType={formElement.config.elementType}
        //         elementConfig={formElement.config.elementConfig}
        //         value={formElement.config.value}
        //         invalid={!formElement.config.valid}
        //         shouldValidate={formElement.config.validation}
        //         touched={formElement.config.touched}
        //         changed={(event) => this.inputChangedHandler(event, formElement.id)} />
        // ));

        // if (this.props.loading) {
        //     form = <Spinner />
        // }

        let errorMessage = null;

        if (this.props.error) {
            errorMessage = (
                <p>{this.props.error.message}</p>
            );
        }

        let authRedirect = null;
        if (this.props.isAuthenticated) {
            authRedirect = <Redirect to={this.props.authRedirectPath} />
        }

        const SignupSchema = Yup.object().shape({
            password: Yup.string()
                .min(6, 'Too Short!')
                .max(50, 'Too Long!')
                .required('Required'),
            email: Yup.string()
                .email('Invalid email')
                .required('Required'),
        });


        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMessage}
                {/* <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form> */}
                {
                    this.props.loading ? <Spinner />
                        : <div>
                            <Formik
                                initialValues={{
                                    email: "",
                                    password: ""
                                }}
                                onSubmit={this.submitHandler}
                                validationSchema={SignupSchema}
                            >
                                {({ errors, touched }) => (
                                    <Form>
                                        <Field name="email" type="email" className={classes.InputElement} />
                                        <div className={classes.label}>
                                            {touched.email && errors.email}
                                        </div>
                                        <Field name="password" type="password" className={classes.InputElement} />
                                        <div className={classes.label}>
                                            {touched.password && errors.password}
                                        </div>
                                        <button type="submit">Submit</button>
                                    </Form>
                                )}
                            </Formik>

                            <Button
                                clicked={this.switchAuthModeHandler}
                                btnType="Danger">SWITCH TO {this.state.isSignup ? 'SIGNIN' : 'SIGNUP'}
                            </Button>
                        </div>
                }
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuthenticated: state.auth.token !== null,
        buildingBurger: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Auth);