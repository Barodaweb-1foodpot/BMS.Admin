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
    createCompanyMaster ,
    getCompanyMaster ,
    removeCompanyMaster ,
    updateCompanyMaster ,
} from "../../functions/Masters/CompanyMaster";
import DeleteModal from "../../Components/Common/DeleteModal";
import FormsHeader from "../../Components/Common/FormsModalHeader";
import FormsFooter from "../../Components/Common/FormAddFooter";

const initialState = {
    companyDetail: "",
    companyName: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    manufacturingLicNo: "G/25/990",
    IsActive: true
};

const CompanyMaster = () => {
    const [values, setValues] = useState(initialState);
    const {
        companyDetail, companyName, email, password, mobile, address, manufacturingLicNo, IsActive
    } = values;
    const [formErrors, setFormErrors] = useState({});
    const [isSubmit, setIsSubmit] = useState(false);
    const [filter, setFilter] = useState(true);

    const [query, setQuery] = useState("");

    const [_id, set_Id] = useState("");
    const [remove_id, setRemove_id] = useState("");

    const [Adminuser, setAdminuser] = useState([]);

    useEffect(() => {
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
        getCompanyMaster (_id)
            .then((res) => {
                setValues({
                    ...values,
                    companyDetail: res.companyDetail,
                    companyName: res.companyName,
                    email: res.email,
                    password: res.password,
                    mobile: res.mobile,
                    address: res.address,
                    manufacturingLicNo: res.manufacturingLicNo,
                    // password: res.password,

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
            createCompanyMaster (values)
                .then((res) => {
                    if (res.isOk) {
                        setmodal_list(!modal_list);
                        setValues(initialState);
                        setIsSubmit(false);
                        setFormErrors({});
                        fetchUsers();
                    } else {
                        setErrEM(true);
                        setFormErrors({ email: "Email already exists!" });
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
            }

        };

        const handleDelete = (e) => {
            e.preventDefault();
            removeCompanyMaster (remove_id)
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
                updateCompanyMaster (_id, values)
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

            if (values.companyDetail === "") {
                errors.companyDetail = "Company Detail is required!";
                // setErrFN(true);
            }
            if (values.companyDetail !== "") {
                // setErrFN(false);
            }

            if (values.companyName === "") {
                errors.companyName = "Company Name is required!";
                // setErrLN(true);
            }
            if (values.companyName !== "") {
                // setE?rrLN(false);
            }
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (values.email === "") {
                errors.email = "Email is required!";
                // setErrEM(true);
            }
            if (!emailRegex.test(values.email)) {
                errors.email = "Please enter a valid email address!";
              }
              
            if (values.email !== "") {
                // setErrEM(false);
            }

            if (values.password === "") {
                errors.password = "Password is required!";
                // setErrPA(true);
            }
            if (values.password !== "") {
                // setErrPA(false);
            }
            if (values.address === "") {
                errors.address = "Address is required!";
                // setErrFN(true);
            }
            if (values.address !== "") {
                // setErrFN(false);
            }
            const mobileRegex = /^\d{10}$/;

            if (values.mobile === "") {
                errors.mobile = "Mobile is required!";
                // setErrLN(true);
            }
            if (!mobileRegex.test(values.mobile)) {
                errors.mobile = "Mobile number must be exactly 10 digits!";
              }
              
            if (values.mobile !== "") {
                // setErrLN(false);
            }

            if (values.manufacturingLicNo === "") {
                errors.manufacturingLicNo = "Manufacturing Licence No is required!";
                // setErrLN(true);
            }
            if (values.manufacturingLicNo !== "") {
                // setErrLN(false);
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
                    `${process.env.REACT_APP_API_URL}/api/auth/listByparams/CompanyMaster`,
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
                    name: "Company Name",
                    selector: (row) => row.companyName,
                    sortable: true,
                    sortField: "companyName",
                    minWidth: "150px",
                },
            {
                name: "Email",
                selector: (row) => row.email,
                sortable: true,
                sortField: "email",
                minWidth: "150px",
            },
            {
                name: "Mobile No",
                selector: (row) => row.mobile,
                sortable: true,
                sortField: "email",
                minWidth: "150px",
            },
            {
                name: "Licence No",
                selector: (row) => row.manufacturingLicNo,
                sortable: true,
                sortField: "email",
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

        document.title = "Company  | BMS";

        return (
            <React.Fragment>
                <div className="page-content">
                    <Container fluid>
                        <BreadCrumb maintitle="" title="Company " pageTitle="" />
                        <Row>
                            <Col lg={12}>
                                <Card>
                                    <CardHeader>
                                        <FormsHeader
                                            formName="Company "
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
                        Add Company
                    </ModalHeader>
                    <form>
                        <ModalBody>
                            <Label>
                                Company Name <span className="text-danger">*</span>
                            </Label>
                            <div className="form-floating mb-3">

                                <Input
                                    type="text"
                                    className={validClassFN}
                                    // placeholder="Enter Co"   
                                    required
                                    name="companyName"
                                    value={companyName}
                                    onChange={handleChange}
                                />

                                {isSubmit && (
                                    <p className="text-danger">{formErrors.companyName}</p>
                                )}
                            </div>
                            <Label>
                                Company Detail <span className="text-danger">*</span>
                            </Label>
                            <div className="form-floating mb-3">
                                <Input
                                    type="text"
                                    className={validClassLN}
                                    // placeholder="Enter last Name"
                                    required
                                    name="companyDetail"
                                    value={companyDetail}
                                    onChange={handleChange}
                                />

                                {isSubmit && <p className="text-danger">{formErrors.companyDetail}</p>}
                            </div>
                            <Label>
                                Email <span className="text-danger">*</span>
                            </Label>
                            <div className="form-floating mb-3">
                                <Input
                                    type="text"
                                    className={validClassEM}
                                    placeholder="Enter email "
                                    required
                                    name="email"
                                    value={email}
                                    onChange={handleChange}
                                />

                                {isSubmit && <p className="text-danger">{formErrors.email}</p>}
                            </div>
                            <Label>
                                Password <span className="text-danger">*</span>
                            </Label>
                            <div className="form-floating mb-3">
                                <Input
                                    type="text"
                                    className={validClassPA}
                                    placeholder="Enter password"
                                    required
                                    name="password"
                                    value={password}
                                    onChange={handleChange}
                                />

                                {isSubmit && <p className="text-danger">{formErrors.password}</p>}
                            </div>

                            <Label>
                                Mobile Number <span className="text-danger">*</span>
                            </Label>
                            <div className="form-floating mb-3">

                                <Input
                                    type="number"
                                    onWheel={(e) => e.target.blur()} // Disable scrolling increment
                                    className={validClassMB}
                                    // placeholder="Enter first Name"
                                    required
                                    name="mobile"
                                    value={mobile}
                                    onChange={handleChange}
                                />

                                {isSubmit && (
                                    <p className="text-danger">{formErrors.mobile}</p>
                                )}
                            </div>

                            <Label>
                                Address <span className="text-danger">*</span>
                            </Label>
                            <div className="form-floating mb-3">

                                <Input
                                    type="text"
                                    className={validClassAdd}
                                    // placeholder="Enter first Name"
                                    required
                                    name="address"
                                    value={address}
                                    onChange={handleChange}
                                />

                                {isSubmit && (
                                    <p className="text-danger">{formErrors.address}</p>
                                )}
                            </div>

                            <Label>
                                Manufacturing Licence No. <span className="text-danger">*</span>
                            </Label>
                            <div className="form-floating mb-3">

                                <Input
                                    type="text"
                                    className={validClassMFL}
                                    // placeholder="Enter first Name"
                                    required
                                    name="manufacturingLicNo"
                                    value={manufacturingLicNo}
                                    onChange={handleChange}
                                />

                                {isSubmit && (
                                    <p className="text-danger">{formErrors.manufacturingLicNo}</p>
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
                        Edit Company
                    </ModalHeader>
                    <form>
                    <ModalBody>
                            <Label>
                                Company Name <span className="text-danger">*</span>
                            </Label>
                            <div className="form-floating mb-3">

                                <Input
                                    type="text"
                                    className={validClassFN}
                                    // placeholder="Enter Co"   
                                    required
                                    name="companyName"
                                    value={companyName}
                                    onChange={handleChange}
                                />

                                {isSubmit && (
                                    <p className="text-danger">{formErrors.companyName}</p>
                                )}
                            </div>
                            <Label>
                                Company Detail <span className="text-danger">*</span>
                            </Label>
                            <div className="form-floating mb-3">
                                <Input
                                    type="text"
                                    className={validClassLN}
                                    // placeholder="Enter last Name"
                                    required
                                    name="companyDetail"
                                    value={companyDetail}
                                    onChange={handleChange}
                                />

                                {isSubmit && <p className="text-danger">{formErrors.companyDetail}</p>}
                            </div>
                            <Label>
                                Email <span className="text-danger">*</span>
                            </Label>
                            <div className="form-floating mb-3">
                                <Input
                                    type="text"
                                    className={validClassEM}
                                    placeholder="Enter email "
                                    required
                                    name="email"
                                    value={email}
                                    onChange={handleChange}
                                />

                                {isSubmit && <p className="text-danger">{formErrors.email}</p>}
                            </div>
                            <Label>
                                Password <span className="text-danger">*</span>
                            </Label>
                            <div className="form-floating mb-3">
                                <Input
                                    type="text"
                                    className={validClassPA}
                                    placeholder="Enter password"
                                    required
                                    name="password"
                                    value={password}
                                    onChange={handleChange}
                                />

                                {isSubmit && <p className="text-danger">{formErrors.password}</p>}
                            </div>

                            <Label>
                                Mobile Number <span className="text-danger">*</span>
                            </Label>
                            <div className="form-floating mb-3">

                                <Input
                                    type="number"
                                    onWheel={(e) => e.target.blur()} // Disable scrolling increment
                                    className={validClassMB}
                                    // placeholder="Enter first Name"
                                    required
                                    name="mobile"
                                    value={mobile}
                                    onChange={handleChange}
                                />

                                {isSubmit && (
                                    <p className="text-danger">{formErrors.mobile}</p>
                                )}
                            </div>

                            <Label>
                                Address <span className="text-danger">*</span>
                            </Label>
                            <div className="form-floating mb-3">

                                <Input
                                    type="text"
                                    className={validClassAdd}
                                    // placeholder="Enter first Name"
                                    required
                                    name="address"
                                    value={address}
                                    onChange={handleChange}
                                />

                                {isSubmit && (
                                    <p className="text-danger">{formErrors.address}</p>
                                )}
                            </div>

                            <Label>
                                Manufacturing Licence No. <span className="text-danger">*</span>
                            </Label>
                            <div className="form-floating mb-3">

                                <Input
                                    type="text"
                                    className={validClassMFL}
                                    // placeholder="Enter first Name"
                                    required
                                    name="manufacturingLicNo"
                                    value={manufacturingLicNo}
                                    onChange={handleChange}
                                />

                                {isSubmit && (
                                    <p className="text-danger">{formErrors.manufacturingLicNo}</p>
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

    export default CompanyMaster;
