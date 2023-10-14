import React, { useState } from 'react'
import { useEffect } from 'react';
import { Modal } from 'react-bootstrap';

const ImageModal = ({
    show,
    handleClose,
    data,
}) => {




    return (
        <Modal show={show}>
            <Modal.Header className='modal-header'>
                <Modal.Title className='modal-title'>
                    {data.type}&nbsp;of&nbsp;{data.name}
                </Modal.Title>
                <button type='button' className='close' onClick={handleClose}>x</button>
            </Modal.Header>
            <Modal.Body>
                <div className='modal.body'>
                    <img src={data.image} alt={`${data.type} of ${data.name}`} style={{ width: "100%", height: "450px" }} />
                </div>
            </Modal.Body>
        </Modal>
    )
}

export default ImageModal
