import React, { useState } from 'react';
import '../css/CustomDrop.css'
import { Dropdown } from 'react-bootstrap';
import { FiHome } from 'react-icons/fi';
const CustomDrop = ({ options, onSelect }) => {
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleOptionClick = (option) => {
    const selectedIndex = selectedOptions.indexOf(option);
    let newSelectedOptions = [...selectedOptions];

    if (selectedIndex === -1) {
      // Option is not selected, so select it
      newSelectedOptions.push(option);
    } else {
      // Option is already selected, so deselect it
      newSelectedOptions.splice(selectedIndex, 1);
    }

    setSelectedOptions(newSelectedOptions);
    onSelect(newSelectedOptions);
  };

  return (
    <Dropdown>
      <Dropdown.Toggle variant="success" id="dropdown-basic">
        Select Options
      </Dropdown.Toggle>
      <Dropdown.Menu style={{ maxHeight: '200px', overflowY: 'auto' }}>
        {options.map((option, index) => (
          <Dropdown.Item key={index} className="dropdown-item">
            <input
              type="checkbox"
              id={option}
              value={option}
              checked={selectedOptions.includes(option)}
              onChange={() => handleOptionClick(option)}
            />
            <label htmlFor={option}>
              {option}
              <div className="icon-container">
                {selectedOptions.includes(option) && <FiHome className="room-icon" />}
              </div>
            </label>
          </Dropdown.Item>
        ))}
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default CustomDrop;
