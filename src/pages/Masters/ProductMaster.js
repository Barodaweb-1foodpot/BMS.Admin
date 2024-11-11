import React, { useState, useEffect } from "react";
import {
    Button,
    Card,
    CardBody,
    CardHeader,
    Col,
    Container,
    ListGroup,
    ListGroupItem,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Label,
    Input,
    Row,
} from "reactstrap";
import BreadCrumb from "../../Components/Common/BreadCrumb";
import axios from "axios";
import DataTable from "react-data-table-component";

import {
    createProductMaster,
    getProductMaster,
    removeProductMaster,
    updateProductMaster,
} from "../../functions/Masters/ProductMaster";
import DeleteModal from "../../Components/Common/DeleteModal";
import FormsHeader from "../../Components/Common/FormsModalHeader";
import FormsFooter from "../../Components/Common/FormAddFooter";
import { toast, ToastContainer } from "react-toastify";

const initialState = {
    productName: "",
    productCode: "",
    CASNo: "",
    specialsStorageCondition: "Protect from direct source of light",
    IsActive: true
};

const ProductMaster = () => {
    const [values, setValues] = useState(initialState);
    const {
        productName, productCode, CASNo, specialsStorageCondition, IsActive
    } = values;
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [filter, setFilter] = useState(true);

    const [query, setQuery] = useState("");

    const [_id, set_Id] = useState("");
    const [remove_id, setRemove_id] = useState("");

    const [Adminuser, setAdminuser] = useState([]);

    useEffect(() => {
        console.log(formErrors);
        if (Object.keys(formErrors).length === 0 && isSubmit) {
            console.log("no errors");
        }
    }, [formErrors, isSubmit]);

    const [modal_list, setmodal_list] = useState(false);
    const tog_list = () => {
        setmodal_list(!modal_list);
        setValues(initialState);
        setIsSubmit(false);
    };

    const [modal_delete, setmodal_delete] = useState(false);
    const tog_delete = (_id) => {
        setmodal_delete(!modal_delete);
        setRemove_id(_id);
    };

    const [modal_edit, setmodal_edit] = useState(false);
    const handleTog_edit = (_id) => {
        setmodal_edit(!modal_edit);
        setIsSubmit(false);
        set_Id(_id);
        getProductMaster(_id)
            .then((res) => {
                setValues({
                    ...values,
                    productName: res.productName,
                    productCode: res.productCode,
                    CASNo: res.CASNo,
                    specialsStorageCondition: res.specialsStorageCondition,
                    CASNo: res.CASNo,

                    IsActive: res.IsActive,
                });
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleChange = (e) => {
        setValues({ ...values, [e.target.name]: e.target.value });
    };

    const handleCheck = (e) => {
        setValues({ ...values, IsActive: e.target.checked });
    };

    const handleSubmitCancel = () => {
        setmodal_list(false);
        setValues(initialState);
        setIsSubmit(false);
    };

    const handleClick = (e) => {
        e.preventDefault();
        setFormErrors({});
        setIsSubmit(true);
        let errors = validate(values);
        setFormErrors(errors);
        setIsSubmit(true);

        if (Object.keys(errors).length === 0) {
            createProductMaster(values)
                .then((res) => {
                    console.log("res", res);
                    if (res.isOk) {
                        setmodal_list(!modal_list);
                        setValues(initialState);
                        setIsSubmit(false);
                        setFormErrors({});
                        fetchUsers();
                    } else {
                        toast.error(res.message)
                        setErrEM(true);
                        // setFormErrors({ email: "Email already exists!" });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        }

    };

    const handleDelete = (e) => {
        e.preventDefault();
        removeProductMaster(remove_id)
            .then((res) => {
                setmodal_delete(!modal_delete);
                fetchUsers();
            })
            .catch((err) => {
                console.log(err);
            });
    };

    const handleDeleteClose = (e) => {
        e.preventDefault();
        setmodal_delete(false);
    };

    const handleUpdate = (e) => {
        e.preventDefault();
        let erros = validate(values);
        setFormErrors(erros);
        setIsSubmit(true);

        if (Object.keys(erros).length === 0) {
            updateProductMaster(_id, values)
                .then((res) => {
                    setmodal_edit(!modal_edit);
                    fetchUsers();
                })
                .catch((err) => {
                    console.log(err);
                });
        }
    };

    const [errFN, setErrFN] = useState(false);
    const [errLN, setErrLN] = useState(false);
    const [errEM, setErrEM] = useState(false);
    const [errPA, setErrPA] = useState(false);
    const [errAdd, setErrAdd] = useState(false);
    const [errMB, setErrMB] = useState(false);
    const [errMFL, setErrMFL] = useState(false);
    const validate = () => {
        const errors = {};

        if (values.productName === "") {
            errors.productName = "Product Detail is required!";
            // setErrFN(true);
        }
        if (values.productName !== "") {
            // setErrFN(false);
        }



        if (values.CASNo === "") {
            errors.CASNo = "Password is required!";
            // setErrPA(true);
        }
        if (values.CASNo !== "") {
            // setErrPA(false);
        }
        

        return errors;
    };

    const validClassFN =
        errFN && isSubmit ? "p-2 h-100  form-control is-invalid" : "p-2 h-100 form-control";

    const validClassLN =
        errLN && isSubmit ? "p-2 h-100 form-control is-invalid" : "p-2 h-100 form-control";

    const validClassEM =
        errEM && isSubmit ? "p-2 h-100 form-control is-invalid" : "p-2 h-100 form-control";

    const validClassPA =
        errPA && isSubmit ? "p-2 h-100 form-control is-invalid" : "p-2 h-100 form-control";

    const validClassMFL =
        errMFL && isSubmit ? "p-2 h-100 form-control is-invalid" : "p-2 h-100 form-control";

    const validClassAdd =
        errAdd && isSubmit ? "p-2 h-100 form-control is-invalid" : "p-2 h-100 form-control";

    const validClassMB =
        errMB && isSubmit ? "p-2 h-100 form-control is-invalid" : "p-2 h-100 form-control";

    const [loading, setLoading] = useState(false);
    const [totalRows, setTotalRows] = useState(0);
    const [perPage, setPerPage] = useState(10);
    const [pageNo, setPageNo] = useState(0);
    const [column, setcolumn] = useState();
    const [sortDirection, setsortDirection] = useState();

    const handleSort = (column, sortDirection) => {
        setcolumn(column.sortField);
        setsortDirection(sortDirection);
    };

    useEffect(() => {
        // fetchUsers(1); // fetch page 1 of users
    }, []);

    useEffect(() => {
        fetchUsers();
    }, [pageNo, perPage, column, sortDirection, query, filter]);

    const fetchUsers = async () => {
        setLoading(true);
        let skip = (pageNo - 1) * perPage;
        if (skip < 0) {
            skip = 0;
        }

        await axios
            .post(
                `${process.env.REACT_APP_API_URL}/api/auth/listByparams/ProductMaster`,
                {
                    skip: skip,
                    per_page: perPage,
                    sorton: column,
                    sortdir: sortDirection,
                    match: query,
                    IsActive: filter,
                }
            )
            .then((response) => {
                if (response.length > 0) {
                    let res = response[0];
                    setLoading(false);
                    setAdminuser(res.data);
                    setTotalRows(res.count);
                } else if (response.length === 0) {
                    setAdminuser([]);
                }
                // console.log(res);
            });

        setLoading(false);
    };

    const handlePageChange = (page) => {
        setPageNo(page);
    };

    const handlePerRowsChange = async (newPerPage, page) => {
        // setPageNo(page);
        setPerPage(newPerPage);
    };
    const handleFilter = (e) => {
        setFilter(e.target.checked);
    };
    const col = [
        {
            name: "Product Name",
            selector: (row) => row.productName,
            sortable: true,
            sortField: "productName",
            minWidth: "150px",
        },
        {
            name: "Product Code",
            selector: (row) => row.productCode || "-",
            sortable: true,
            sortField: "productCode",
            minWidth: "150px",
        },


        {
            name: "CAS No",
            selector: (row) => row.CASNo,
            sortable: true,
            sortField: "CASNo",
            minWidth: "150px",
        },
        
        {
            name: "Action",
            selector: (row) => {
                return (
                    <React.Fragment>
                        <div className="d-flex gap-2">
                            <div className="edit">
                                <button
                                    className="btn btn-sm btn-success edit-item-btn "
                                    data-bs-toggle="modal"
                                    data-bs-target="#showModal"
                                    onClick={() => handleTog_edit(row._id)}
                                >
                                    Edit
                                </button>
                            </div>

                            <div className="remove">
                                <button
                                    className="btn btn-sm btn-danger remove-item-btn"
                                    data-bs-toggle="modal"
                                    data-bs-target="#deleteRecordModal"
                                    onClick={() => tog_delete(row._id)}
                                >
                                    Remove
                                </button>
                            </div>
                        </div>
                    </React.Fragment>
                );
            },
            sortable: false,
            minWidth: "180px",
        },
    ];

    document.title = "Product  | BMS";

    return (
        <React.Fragment>
            <ToastContainer />
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb maintitle="" title="Product " pageTitle="" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <FormsHeader
                                        formName="Product "
                                        filter={filter}
                                        handleFilter={handleFilter}
                                        tog_list={tog_list}
                                        setQuery={setQuery}
                                    />
                                </CardHeader>

                                <CardBody>
                                    <div id="customerList">
                                        <div className="table-responsive table-card mt-1 mb-1 text-right">
                                            <DataTable
                                                columns={col}
                                                data={Adminuser}
                                                progressPending={loading}
                                                sortServer
                                                onSort={(column, sortDirection, sortedRows) => {
                                                    handleSort(column, sortDirection);
                                                }}
                                                pagination
                                                paginationServer
                                                paginationTotalRows={totalRows}
                                                paginationRowsPerPageOptions={[10, 50, 100, totalRows]}
                                                onChangeRowsPerPage={handlePerRowsChange}
                                                onChangePage={handlePageChange}
                                            />
                                        </div>
                                    </div>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </div>

            {/* Add Modal */}
            <Modal
                isOpen={modal_list}
                toggle={() => {
                    tog_list();
                }}
                centered
            >
                <ModalHeader
                    className="bg-light p-3"
                    toggle={() => {
                        setmodal_list(false);
                        setIsSubmit(false);
                    }}
                >
                    Add Product
                </ModalHeader>
                <form>
                    <ModalBody>

                        <Label>
                            Product Name <span className="text-danger">*</span>
                        </Label>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                className={validClassLN}
                                // placeholder="Enter last Name"
                                required
                                name="productName"
                                value={productName}
                                onChange={handleChange}
                            />

                            {isSubmit && <p className="text-danger">{formErrors.productName}</p>}
                        </div>
                        <Label>
                            Product Code
                        </Label>
                        <div className="form-floating mb-3">

                            <Input
                                type="text"
                                className={validClassFN}
                                // placeholder="Enter Co"   
                                required
                                name="productCode"
                                value={productCode}
                                onChange={handleChange}
                            />


                        </div>
                        <Label>
                            CAS No <span className="text-danger">*</span>
                        </Label>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                className={validClassPA}
                                placeholder="Enter CASNo"
                                required
                                name="CASNo"
                                value={CASNo}
                                onChange={handleChange}
                            />

                            {isSubmit && <p className="text-danger">{formErrors.CASNo}</p>}
                        </div>



                        <Label>
                            Spacial Storage Condition 
                        </Label>
                        <div className="form-floating mb-3">

                            <Input
                                type="text"
                                className={validClassAdd}
                                // placeholder="Enter first Name"
                                required
                                name="specialsStorageCondition"
                                value={specialsStorageCondition}
                                onChange={handleChange}
                            />

                            {isSubmit && (
                                <p className="text-danger">{formErrors.specialsStorageCondition}</p>
                            )}
                        </div>



                        <div className="form-check mb-2">
                            <Input
                                type="checkbox"
                                className="form-check-input"
                                name="IsActive"
                                checked={IsActive}
                                value={IsActive}
                                onChange={handleCheck}
                            />
                            <Label className="form-check-label">Is Active</Label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <FormsFooter
                            handleSubmit={handleClick}
                            handleSubmitCancel={handleSubmitCancel}
                        />
                    </ModalFooter>
                </form>
            </Modal>

            {/* Edit Modal */}
            <Modal
                isOpen={modal_edit}
                toggle={() => {
                    handleTog_edit();
                }}
                centered
            >
                <ModalHeader
                    className="bg-light p-3"
                    toggle={() => {
                        setmodal_edit(false);
                        setIsSubmit(false);
                    }}
                >
                    Edit Product
                </ModalHeader>
                <form>
                    <ModalBody>

                        <Label>
                            Product Name <span className="text-danger">*</span>
                        </Label>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                className={validClassLN}
                                // placeholder="Enter last Name"
                                required
                                name="productName"
                                value={productName}
                                onChange={handleChange}
                            />

                            {isSubmit && <p className="text-danger">{formErrors.productName}</p>}
                        </div>
                        <Label>
                            Product Code
                        </Label>
                        <div className="form-floating mb-3">

                            <Input
                                type="text"
                                className={validClassFN}
                                // placeholder="Enter Co"   
                                required
                                name="productCode"
                                value={productCode}
                                onChange={handleChange}
                            />


                        </div>
                        <Label>
                            CAS No <span className="text-danger">*</span>
                        </Label>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                className={validClassPA}
                                placeholder="Enter CASNo"
                                required
                                name="CASNo"
                                value={CASNo}
                                onChange={handleChange}
                            />

                            {isSubmit && <p className="text-danger">{formErrors.CASNo}</p>}
                        </div>



                        <Label>
                            Spacial Storage Condition 
                        </Label>
                        <div className="form-floating mb-3">

                            <Input
                                type="text"
                                className={validClassAdd}
                                // placeholder="Enter first Name"
                                required
                                name="specialsStorageCondition"
                                value={specialsStorageCondition}
                                onChange={handleChange}
                            />

                            {isSubmit && (
                                <p className="text-danger">{formErrors.specialsStorageCondition}</p>
                            )}
                        </div>



                        <div className="form-check mb-2">
                            <Input
                                type="checkbox"
                                className="form-check-input"
                                name="IsActive"
                                checked={IsActive}
                                value={IsActive}
                                onChange={handleCheck}
                            />
                            <Label className="form-check-label">Is Active</Label>
                        </div>
                    </ModalBody>
                    <ModalFooter>
                        <div className="hstack gap-2 justify-content-end">
                            <button
                                type="submit"
                                className="btn btn-success"
                                id="add-btn"
                                onClick={handleUpdate}
                            >
                                Update
                            </button>

                            <button
                                type="button"
                                className="btn btn-outline-danger"
                                onClick={() => {
                                    setmodal_edit(false);
                                    setIsSubmit(false);
                                    setFormErrors({});
                                }}
                            >
                                Cancel
                            </button>
                        </div>
                    </ModalFooter>
                </form>
            </Modal>

            <DeleteModal
                show={modal_delete}
                handleDelete={handleDelete}
                toggle={handleDeleteClose}
                setmodal_delete={setmodal_delete}
            />
        </React.Fragment>
    );
};

export default ProductMaster;
