import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Formik, Form, Field } from "formik";
import * as Yup from 'yup';
import Button from '../../../components/UI/Button/Button';
import Spinner from '../../../components/UI/Spinner/Spinner';
import classes from './ContactData.css';
import axios from '../../../axios-orders';
import Input from '../../../components/UI/Input/Input';
import withErrorHandler from '../../../hoc/withErrorHandler/withErrorHandler'
import * as actions from '../../../store/actions/index';

class ContactData extends Component {
    state = {
        orderForm: {
            name: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Your Name'
                },
                value: ''
            },
            street: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Street'
                },
                value: ''
            },
            zipCode: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'ZIP Code'
                }
            },
            country: {
                elementType: 'input',
                elementConfig: {
                    type: 'text',
                    placeholder: 'Country'
                }
            },
            email: {
                elementType: 'input',
                elementConfig: {
                    type: 'email',
                    placeholder: 'Your E-Mail'
                }
            },
            deliveryMethod: {
                elementType: 'select',
                elementConfig: {
                    options: [
                        { value: 'fastest', displayValue: 'Fastest' },
                        { value: 'cheapest', displayValue: 'Cheapest' }
                    ]
                },
                value: 'fastest'
            }
        }
    }

    orderHandler = (values) => {
        // event.preventDefault();

        // const formData = {};
        // for (let formElementIdentifier in this.state.orderForm) {
        //     formData[formElementIdentifier] = this.state.orderForm[formElementIdentifier].value;
        // }
        const order = {
            ingredients: this.props.ings,
            price: this.props.price,
            orderData: values,
            userId: this.props.userId
        }

        this.props.onOrderBurger(order, this.props.token);

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

    // inputChangedHandler = (event, inputIdentifier) => {
    //     const updatedOrderForm = {
    //         ...this.state.orderForm
    //     };
    //     const updatedFormElement = {
    //         ...updatedOrderForm[inputIdentifier]
    //     };
    //     updatedFormElement.value = event.target.value;
    //     updatedFormElement.valid = this.checkValidity(updatedFormElement.value, updatedFormElement.validation);
    //     updatedFormElement.touched = true;
    //     updatedOrderForm[inputIdentifier] = updatedFormElement;

    //     let formIsValid = true;
    //     for (let inputIdentifier in updatedOrderForm) {
    //         formIsValid = updatedOrderForm[inputIdentifier].valid && formIsValid;
    //     }
    //     this.setState({ orderForm: updatedOrderForm, formIsValid: formIsValid });
    // }

    render() {
        const formElementsArray = [];
        for (let key in this.state.orderForm) {
            formElementsArray.push({
                id: key,
                config: this.state.orderForm[key]
            });
            // console.log(formElementsArray[0].id);
        }
        // let form = (
        //     <form onSubmit={this.orderHandler}>
        //         {formElementsArray.map(formElement => (
        //             // <Input 
        //             //     key={formElement.id}
        //             //     elementType={formElement.config.elementType}
        //             //     elementConfig={formElement.config.elementConfig}
        //             //     value={formElement.config.value}
        //             //     invalid={!formElement.config.valid}
        //             //     shouldValidate={formElement.config.validation}
        //             //     touched={formElement.config.touched}
        //             //     changed={(event) => this.inputChangedHandler(event, formElement.id)} />
        //             <div>
        //                 <Field name="email" type={formElement.config.elementConfig.type} value={formElement.config.value} className={classes.InputElement} />
        //                 <div className={classes.label}>
        //                     {touched.email && errors.email}
        //                 </div>
        //             </div>
        //         ))}
        //         <Button btnType="Success" disabled={!this.state.formIsValid}>ORDER</Button>
        //     </form>
        // );

        // if (this.props.loading) {
        //     form = <Spinner />;
        // }


        const SignupSchema = Yup.object().shape({
            name: Yup.string()
                .required('Required'),
            street: Yup.string()
                .required('Required'),
            zipCode: Yup.string().
                matches(/^[0-9]{6}$/, 'Must be exactly 6 digits')
                .required('Required'),
            country: Yup.string()
                .required('Required'),
            email: Yup.string()
                .email('Invalid email')
                .required('Required')
        });

        return (
            <div className={classes.ContactData}>
                <h4>Enter your Contact Data</h4>
                {/* {form} */}
                <Formik
                    initialValues={{
                        name: "",
                        street: "",
                        zipCode: "",
                        country: "",
                        email: ""
                    }}
                    onSubmit={this.orderHandler}
                    validationSchema={SignupSchema}
                >
                    {({ errors, touched, isValid , dirty}) => (
                        <Form>
                            {formElementsArray.map(formElement => (
                                 <div>
                                    <Field
                                        name={formElement.id}
                                        key={formElement.id}
                                        as={formElement.config.elementType}
                                        className={classes.InputElement}
                                        {...formElement.config.elementConfig}
                                        value={formElement.config.value ? formElement.config.value : null}
                                    >
                                        {formElement.config.value ? formElement.config.elementConfig.options.map(option => (
                                            <option key={option.value} value={option.value}>
                                                {option.displayValue}
                                            </option>
                                        )) : null}
                                    </Field>

                                    <div className={classes.label}>
                                        {touched[formElement.id] && errors[formElement.id]}
                                    </div>
                                </div>
                            
                    ))}
                            <Button btnType="Success" disabled={!isValid || !dirty}>ORDER</Button>
                        </Form>
                    )}
                </Formik>
            </div>
        );
    }
}

const mapStateToProps = state => {
    return {
        ings: state.burgerBuilder.ingredients,
        price: state.burgerBuilder.totalPrice,
        loading: state.order.loading,
        token: state.auth.token,
        userId: state.auth.userId
    }
};

const mapDispatchToProps = dispatch => {
    return {
        onOrderBurger: (orderData, token) => dispatch(actions.purchaseBurger(orderData, token))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(withErrorHandler(ContactData, axios));