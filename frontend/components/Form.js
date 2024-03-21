import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import '../styles/styles.css';
import '../styles/reset.css';

// Validation schema using Yup
const schema = Yup.object().shape({
  fullName: Yup.string()
    .min(3, 'Full name must be at least 3 characters')
    .max(20, 'Full name must be at most 20 characters')
    .required('Full name is required'),
  size: Yup.string()
    .oneOf(['S', 'M', 'L'], 'Size must be S, M, or L')
    .required('Size is required'),
  toppings: Yup.array()
    .of(
      Yup.number()
        .min(1, 'Topping ID must be at least 1')
        .max(5, 'Topping ID must be at most 5')
        .integer('Topping ID must be an integer')
    )
});

const toppingsOptions = [
  { topping_id: '1', text: 'Pepperoni' },
  { topping_id: '2', text: 'Green Peppers' },
  { topping_id: '3', text: 'Pineapple' },
  { topping_id: '4', text: 'Mushrooms' },
  { topping_id: '5', text: 'Ham' },
];

export default function Form() {
  const [formData, setFormData] = useState({
    fullName: '',
    size: '',
    toppings: [],
  });
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const validateField = async (fieldName, value) => {
      try {
        await Yup.reach(schema, fieldName).validate(value);
        setFormErrors((prevErrors) => ({ ...prevErrors, [fieldName]: '' }));
      } catch (error) {
        setFormErrors((prevErrors) => ({ ...prevErrors, [fieldName]: error.message }));
      }
    };

    validateField('fullName', formData.fullName);
    validateField('size', formData.size);
    // Since toppings validation is not directly tied to input, we won't validate it here
  }, [formData.fullName, formData.size]);

  const handleChange = (event) => {
    const {name, value, type, checked} = event.target;
    setFormData((prev)=> {
      // Update state based on input type
      const updatedFormData = type === 'checkbox' 
      ? {
        ...prev, 
        toppings: checked 
        ? [...prev.toppings, value]
        : prev.toppings.filter((topping) => topping !== value),
      }
      : {
        ...prev, [name]: value, 
      }
    })
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await schema.validate(formData, { abortEarly: false });
      const toppingsCount = formData.toppings.length;
      let toppingsText = `${toppingsCount} ${toppingsCount === 1 ? 'topping' : 'toppings'}`;
      if (toppingsCount === 0) {
        toppingsText = 'no toppings';
      }
      const message = `Thank you for your order, ${formData.fullName}! Your ${formData.size} pizza with ${toppingsText} is on the way.`;
      setSuccessMessage(message);
      setIsSubmitted(true);
      setFormErrors({});
      // Here, you would normally proceed with further form submission steps, e.g., sending data to a server.
    } catch (err) {
      const errors = err.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setFormErrors(errors);
      setIsSubmitted(false);
    }
  };

  const isFormValid = Object.keys(formErrors).length === 0;

  return (
    <div>
      <h2>Order Your Pizza</h2>
      {isSubmitted && <div className="success">{successMessage}</div>}
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="fullName">Full Name</label><br />
          <input
            name="fullName"
            placeholder="Type full name"
            id="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
          />
          {formErrors.fullName && <div className='error'>{formErrors.fullName}</div>}
        </div>

        <div className="input-group">
          <label htmlFor="size">Size</label><br/>
          <select
            name="size"
            id="size"
            value={formData.size}
            onChange={handleChange}
          >
            <option value="">----Choose Size----</option>
            <option value="S">S</option>
            <option value="M">M</option>
            <option value="L">L</option>
          </select>
          {formErrors.size && <div className='error'>{formErrors.size}</div>}
        </div>

        <div className="input-group">
          {toppingsOptions.map(({ topping_id, text }) => (
            <label key={topping_id}>
              <input
                name="toppings"
                type="checkbox"
                value={topping_id}
                onChange={handleChange}
                checked={formData.toppings.includes(topping_id)}
              />
              {text}<br />
            </label>
          ))}
        </div>
        <button type="submit" disabled={!isFormValid}>Submit</button>
      </form>
    </div>
  );
}
