
import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';

const toppingOptions = {
  '1': 'Pepperoni',
  '2': 'Green Peppers',
  '3': 'Pineapple',
  '4': 'Mushrooms',
  '5': 'Ham',
};

const validationSchema = Yup.object({
  fullName: Yup.string()
    .trim()
    .min(3, 'Full name must be at least 3 characters')
    .max(20, 'Full name must be 20 characters or less')
    .required('Full name is required'),
  size: Yup.string()
    .required('Please select a size') // Custom message specifically asking to make a selection
    .oneOf(['S', 'M', 'L'], 'Size must be S, M, or L'), // Ensures only valid options are submitted
  toppings: Yup.array().of(Yup.string().oneOf(['1', '2', '3', '4', '5'], 'Invalid topping')),
});

export default function Form() {
  const [orderSuccessMessage, setOrderSuccessMessage] = useState('');


  const formik = useFormik({
    initialValues: {
      fullName: '',
      size: '',
      toppings: [],
    },
    validationSchema,
    onSubmit: (values, { resetForm }) => {
      axios.post('http://localhost:9009/api/order', values)
        .then(response => {
          const toppingsCount = values.toppings.length;
          const sizeText = values.size === 'S' ? 'small' : values.size === 'M' ? 'medium' : 'large';
          const toppingsText = toppingsCount === 0 ? 'no toppings' : toppingsCount === 1 ? '1 topping' : `${toppingsCount} toppings`;
          const message = `Thank you for your order, ${values.fullName}! Your ${sizeText} pizza with ${toppingsText} is on the way.`;
          
          setOrderSuccessMessage(message);
          resetForm();
        })
        .catch(error => {
          alert('Order Failed!');
          console.error('Order Failed:', error);
        });
    },
  });

  const handleToppingChange = e => {
    const { value, checked } = e.target;
    const { toppings } = formik.values;
    if (checked) {
      formik.setFieldValue('toppings', [...toppings, value]);
    } else {
      formik.setFieldValue('toppings', toppings.filter(t => t !== value));
    }
  };

  return (
    <div>
      <h2>Order Your Pizza</h2>
      {orderSuccessMessage && <div className="success">{orderSuccessMessage}</div>}
      <form onSubmit={formik.handleSubmit} className="form">
        <div className="input-group">
          <label htmlFor="fullName">Full Name</label>
          <input
            id="fullName"
            name="fullName"
            type="text"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.fullName}
            className={formik.touched.fullName && formik.errors.fullName ? 'input-error' : ''}
          />
          {formik.touched.fullName && formik.errors.fullName && (
            <div className="error">{formik.errors.fullName}</div>
          )}
        </div>

        <div className="input-group">
          <label htmlFor="size">Size</label>
          <select
            id="size"
            name="size"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.size}
            className={formik.touched.size && formik.errors.size ? 'input-error' : ''}
          >
            <option value="">Select a size</option>
            <option value="S">Small</option>
            <option value="M">Medium</option>
            <option value="L">Large</option>
          </select>
          {formik.touched.size && formik.errors.size && (
            <div className="error">{formik.errors.size}</div>
          )}
        </div>

        <div className="input-group">
          <fieldset>
            <legend>Toppings</legend>
            {Object.entries(toppingOptions).map(([id, name]) => (
              <label key={id} className="topping-label">
                <input
                  type="checkbox"
                  name="toppings"
                  value={id}
                  onChange={handleToppingChange}
                  checked={formik.values.toppings.includes(id)}
                /> {name}

      </label>
    ))}
  </fieldset>
</div>


        <button type="submit" disabled={!formik.isValid || formik.isSubmitting || !formik.dirty} className="submit">
          Submit Order
        </button>
      </form>
    </div>
  )}
