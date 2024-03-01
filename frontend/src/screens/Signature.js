import React, { useState, useEffect } from "react";
import { Button, Container, Row, Col, Image } from 'react-bootstrap';
import SignatureCanvas from 'react-signature-canvas';
import { toast } from "react-toastify";
import { API_BASE_URL } from "../config";
import { CLOUD_NAME } from "../config";
import { UPLOAD_PRESET } from "../config";


function Signature() {
    const adminId = JSON.parse(localStorage.getItem('user'))._id;
    const [sign, setSign] = useState();
    const [url, setUrl] = useState('');
    const [editMode, setEditMode] = useState(false); // Track if in edit mode
    const [savedSignature, setSavedSignature] = useState('');
    const notifyA = (msg) => toast.error(msg);
    const notifyB = (msg) => toast.success(msg);

      
    

    const handleClear = () => {
        sign.clear();
        setUrl('');
    };

    const handleGenerate = () => {
        setUrl(sign.getTrimmedCanvas().toDataURL('image/png'));
    };
    const handleSave = async () => {
        // Get the signature image data
        const signatureData = sign.getTrimmedCanvas().toDataURL('image/png');
    
        // Create a FormData object to send the image data to Cloudinary
        const formData = new FormData();
        formData.append("file", signatureData);
        formData.append("upload_preset", UPLOAD_PRESET);
        formData.append("cloud_name", CLOUD_NAME);
    
        try {
            // Upload the signature image to Cloudinary
            const cloudinaryResponse = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
                method: "POST",
                body: formData,
            });
            const cloudinaryData = await cloudinaryResponse.json();
    
            // Set the Cloudinary URL of the uploaded image as the saved signature
            const savedSignatureUrl = cloudinaryData.url;
           
            const adminId = JSON.parse(localStorage.getItem('user'))._id;
            console.log("AdminID")
            console.log(adminId)
            const response = await fetch(`${API_BASE_URL}/api/admin-signature`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    admin_id: adminId,
                    sign_url: savedSignatureUrl
                }),
            });
            const responseData = await response.json();
    
            // Check if the response is successful and display a notification accordingly
            if (response.ok) {
                notifyB("Signature added!");
            } else {
                console.log(responseData.message)
                notifyA(responseData.message);
            }
        } catch (error) {
            console.error(error);
            notifyA(error.message);
        }
    };
    
    const fetchSignature= async() => {
        var res = await fetch(`${API_BASE_URL}/api/admin-signature/${adminId}`)
        res = await res.json()
        console.log(res)
        setSavedSignature(res.signature);
    }


    useEffect(()=>{
        fetchSignature()
    },[])
    
    return (
        <Container className="m">
            <Row>
                <Col>
                    <div style={{ border: "2px solid black", width: 500, height: 200 }}>
                        {editMode ?
                            <SignatureCanvas
                                canvasProps={{ width: 500, height: 200, className: 'sigCanvas' }}
                                ref={data => setSign(data)}
                            />
                            :
                            <Image src={savedSignature} style={{ maxWidth: "100%", maxHeight: "100%" }} />
                        }
                    </div>

                    <br />
                    <Button variant="secondary" onClick={handleClear} style={{ marginRight: "10px" }}>Clear</Button>
                    {editMode ?
                        <Button variant="primary" onClick={handleSave}>Save</Button>
                        :
                        <Button variant="primary" onClick={() => setEditMode(true)}>Edit</Button>
                    }

                    <br /><br />
                    <Image src={url} />
                </Col>
            </Row>
        </Container>
    );
}

export default Signature;
