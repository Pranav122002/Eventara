import React, { useEffect, useState } from 'react';
import { Container, Form, Button, Modal } from 'react-bootstrap';
import { API_BASE_URL } from '../config';
import { toast } from "react-toastify";


const CommitteeForm = () => {
    const notifyA = (msg) => toast.error(msg);
    const notifyB = (msg) => toast.success(msg);
    const user = JSON.parse(localStorage.getItem('user'))
    const [formData, setFormData] = useState({
        committee_name: '',
        committee_image: '',
        committee_desc: '',
        committee_head: user._id,
        frequency: '',
        time: '',
        location: '',
        tags: [],
        budget: '',
        email: '',
        phone_number: '',
        office_location: ''
    });
    const [admins, setAdmins] = useState()

    const fetchAdmin = async () => {
        try {
            var res = await fetch(`${API_BASE_URL}/api/admins`)
            res = await res.json()
            setAdmins(res)
            console.log(res)
        } catch (err) {

        }
    }
    const handleChange = e => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = e => {
        e.preventDefault();
        // Handle form submission (e.g., send data to backend)
        console.log(formData);
    };
    function getRandomImageURL() {
        const randomImageNumber = Math.floor(Math.random() * 1000); // Adjust as needed
        return `https://picsum.photos/200/300?random=${randomImageNumber}`;
    }

    const [showModal, setShowModal] = useState(false);
    // const [admins, setAdmins] = useState([
    //     { id: 1, name: 'Admin 1' },
    //     { id: 2, name: 'Admin 2' },
    //     { id: 3, name: 'Admin 3' },
    //     // Add more admins as needed
    // ]);
    const [selectedAdmins, setSelectedAdmins] = useState([]);

    const handleAdminCheckboxChange = (adminId, isChecked) => {
        if (isChecked) {
            setSelectedAdmins([...selectedAdmins, adminId]);
        } else {
            setSelectedAdmins(selectedAdmins.filter(id => id !== adminId));
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
    };

    const handleModalOpen = () => {
        setShowModal(true)
    }

    const handleModalSubmit = (e) => {
        console.log(formData)
        // Handle submission of selected admins
        console.log('Selected admins:', selectedAdmins);
        e.preventDefault();
        fetch(`${API_BASE_URL}/api/create-committee`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                formData,
                selectedAdmins
            }),
        })
        // Handle form submission (e.g., send data to backend)
        console.log(formData);
        setShowModal(false);
    };
    useEffect(() => {
        fetchAdmin()
    }, [])
    return (
        <Container>
            <h1>Create Committee</h1>
            <Form>
                <Form.Group controlId="committeeName">
                    <Form.Label>Committee Name</Form.Label>
                    <Form.Control
                        type="text"
                        placeholder="Enter committee name"
                        name="committee_name"
                        value={formData.committee_name}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                <Form.Group controlId="committeeDesc">
                    <Form.Label>Committee Description</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="Enter committee description"
                        name="committee_desc"
                        value={formData.committee_desc}
                        onChange={handleChange}
                        required
                    />
                </Form.Group>

                {/* Add other form fields as per your model */}

                <Button variant="primary" onClick={handleModalOpen} >
                    Next
                </Button>
            </Form>
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Select Admins for Approval</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {admins?.map(admin => (
                        <Form.Check
                            key={admin._id}
                            type="checkbox"
                            id={`admin-${admin._id}`}
                            label={admin.name}
                            checked={selectedAdmins.includes(admin._id)}
                            onChange={e => handleAdminCheckboxChange(admin._id, e.target.checked)}
                        />
                    ))}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleModalClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={handleModalSubmit}>
                        Submit
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default CommitteeForm;
