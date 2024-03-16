import React, { useState } from 'react';
import * as Yup from 'yup';
import '../styles/styles.css'
import '../styles/reset.css'

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
    .min(1, 'You must select at least one topping')
    .required('Toppings are required'),
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

  function Form() {
    const [formData, setFormData] = useState({ fullName: '', size: '', toppings: [] });
    const [isFullNameValid, setIsFullNameValid] = useState(false);
    const [isSizeValid, setIsSizeValid] = useState(false);
    const [isFormValid, setIsFormValid] = useState(false);
    
    // Validate fullName
    useEffect(() => {
      const isValid = schema.fields.fullName.isValidSync(formData.fullName);
      setIsFullNameValid(isValid);
    }, [formData.fullName]);
  
    // Validate size
    useEffect(() => {
      const isValid = schema.fields.size.isValidSync(formData.size);
      setIsSizeValid(isValid);
    }, [formData.size]);
  
  const isFormValid = isFullNameValid && isSizeValid;
  
  const handleSubmit = async (event) => {
    event.preventDefault();

      try {
     // Simulate delay (e.g., network request latency)
     await new Promise((resolve) => setTimeout(resolve, 2000)); // 2000 ms delay
      // Validate form data against the schema
      await schema.validate(formData, { abortEarly: false });
      setFormErrors({});
      alert('Form is valid: ' + JSON.stringify(formData));
      // Proceed with form submission logic (e.g., API call)
    } catch (err) {
      // Construct an errors object for display
      const errors = err.inner.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
      }, {});
      setFormErrors(errors);
    }
  };

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    if (type === 'checkbox') {
      setFormData((prev) => ({
        ...prev,
        toppings: checked
          ? [...prev.toppings, value]
          : prev.toppings.filter((topping) => topping !== value),
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Order Your Pizza</h2>

      <div className="input-group">
        <label for="fullName">Full Name</label><br />
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
        <label for="size">Size</label><br/>
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
        {formErrors.toppings && <div className='error'>{formErrors.toppings}</div>}
      </div>
      <button type="submit" disabled = {!isFormFilled}>Submit</button>
    </form>
  )}}