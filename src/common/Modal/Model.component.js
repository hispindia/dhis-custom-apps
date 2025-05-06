import React from 'react'

export default function ModelComponent({ setOpen, open, title = '', actionType, children, actionFunctionCallBack = null, }, ...props) {
    return (
        <>
            {open && (

                <div className="modal fade show d-block" tabIndex="-1">
                    <div className="modal-dialog modal-xl" >
                        <div className="modal-content">
                            <div className="modal-header">
                                <h5 className="modal-title text-dark">{title || ''}</h5>
                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={() => setOpen(false)}
                                ></button>
                            </div>
                            <div className="modal-body" >
                                {children || ''}
                            </div>
                            <div className="modal-footer">
                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={() => setOpen(false)}
                                >
                                    Close
                                </button>
                                {actionType ? <button onClick={() => actionFunctionCallBack()} type="button" className="btn btn-success">{actionType || ''} </button>:""}
                            </div>
                        </div>
                    </div>
                </div>)}
        </>
    )
}
