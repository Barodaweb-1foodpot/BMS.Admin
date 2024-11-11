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
    createQRMaster,
    getQRMaster,
    removeQRMaster,
    updateQRMaster,
} from "../../functions/Masters/QRMaster";
import DeleteModal from "../../Components/Common/DeleteModal";
import FormsHeader from "../../Components/Common/FormsModalHeader";
import FormsFooter from "../../Components/Common/FormAddFooter";
import { toast, ToastContainer } from "react-toastify";
import { listProductMaster } from "../../functions/Masters/ProductMaster"

const initialState = {
    productName: "",
    brandName: "",
    nameOfAPI: "",
    batchNo: "",
    batchSize: "",
    DOM: "",
    DOE: "",
    containerCode: "",
    GW: "",
    TW: "",
    NW: "",
    licenceNo: "G/25/990",
    IsActive: true
};

const QRMaster = () => {
    const [values, setValues] = useState(initialState);
    const {
        productName,
        brandName,
        nameOfAPI,
        batchNo,
        batchSize,
        DOM,
        DOE,
        containerCode,
        GW,
        TW,
        NW,
        licenceNo,
        IsActive
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
        getQRMaster(_id)
            .then((res) => {
                
                setValues({
                    ...values,
                    productName: res.find.productName._id,
                    brandName: res.find.brandName || "",
                    nameOfAPI: res.find.nameOfAPI || "",
                    batchNo: res.find.batchNo || "",
                    batchSize: res.find.batchSize || "",

                    IsActive: res.find.IsActive,
                    DOM: res.find.DOM,
                    DOE: res.find.DOE || "",
                    containerCode: res.find.containerCode || "",
                    GW: res.find.GW || "",
                    TW: res.find.TW || "",

                    NW: res.find.NW || "",
                    licenceNo: res.find.licenceNo || ""
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
            createQRMaster(values)
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
        removeQRMaster(remove_id)
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
            updateQRMaster(_id, values)
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
            errors.productName = "Product Name is required!";

        }
        if (values.nameOfAPI === "") {
            errors.CASNo = "Name of API is required!";
        }
        if (values.batchNo === "") {
            errors.batchNo = "Batch No is required!";
        }

        if (values.batchSize === "") {
            errors.batchSize = "Batch Size is required!";
        }

        if (!values.DOM) {
            errors.DOM = "Date of Manufacture (DOM) is required!";
        }

        if (!values.DOE) {
            errors.DOE = "Date of Expiry (DOE) is required!";
        }

        if (values.containerCode === "") {
            errors.containerCode = "Container Code is required!";
        }

        if (values.GW === "") {
            errors.GW = "Gross Weight (GW) is required!";
        }

        if (values.TW === "") {
            errors.TW = "Tare Weight (TW) is required!";
        }

        if (values.NW === "") {
            errors.NW = "Net Weight (NW) is required!";
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
                `${process.env.REACT_APP_API_URL}/api/auth/listByparams/QRMaster`,
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



    useEffect(() => {
        loadProducts()
    }, []);

    const [productData, setProductData] = useState([])

    const loadProducts = async () => {
        listProductMaster().then((res) => setProductData(res));
    };

    const downloadFile = async (url, name = "downloadedFile") => {
        const encodedUrl = encodeURI(url);
        // console.log(encodedUrl);

        fetch(encodedUrl, {
            method: "GET",
            headers: {},
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Network response was not ok ${response.statusText}`);
                }
                return response.blob();
            })
            .then((blob) => {
                const contentType = blob.type;
                const extension = contentType.split("/")[1] || "pdf"; // Default to pdf if no extension is detected
                const blobUrl = window.URL.createObjectURL(blob);
                const link = document.createElement("a");
                link.href = blobUrl;
                link.setAttribute("download", `${name}.${extension}`);
                document.body.appendChild(link);
                link.click();
                link.parentNode.removeChild(link);
                window.URL.revokeObjectURL(blobUrl);
                toast.success("PDF downloaded Successfully")
            })
            .catch((e) => console.error("Download error:", e));
    };

    const [loading2, setLoading2] = useState(false)
    const handleDownload = async (_id) => {
        setLoading2(true);
        try {
            const res = await axios.post(`${process.env.REACT_APP_API_URL}/api/auth/downloadfile`, { qrId: _id });
            console.log(res)
            if (res.isOk) {
                // const fileUrl = `${process.env.REACT_APP_API_URL}/uploads/BMI/${res.filename}`;
                // window.open(fileUrl, "_blank");
                toast.success(res.message);
                await downloadFile(`${process.env.REACT_APP_API_URL}/uploads/BMI/${res.filename}`);

                const data = { fileName: res.filename };
                const dataQR = { fileName: res.qrCodeFilename };
                await deleteFile(data);
                await deleteFile(dataQR);
            } else {
                toast.error(res.data.message);
            }
            setLoading2(false); // Moved outside the if-else to handle both success and error states
        } catch (err) {
            toast.error("Something went wrong");
            console.log(err);
            setLoading2(false);
        }
    };



    const deleteFile = (data) => {
        try {
            axios.post(`${process.env.REACT_APP_API_URL}/api/auth/delete-file`, data).then((res) => {
                console.log(res)

            })
        }
        catch (error) {
            console.log(error)
        }
    }

    const col = [
        {
            name: "Name Of API",
            selector: (row) => row.nameOfAPI,
            sortable: true,
            sortField: "nameOfAPI",
            minWidth: "50px",
        },
        {
            name: "Batch No",
            selector: (row) => row.batchNo || "-",
            sortable: true,
            sortField: "batchNo",
            minWidth: "50px",
        },


        {
            name: "Batch Size",
            selector: (row) => row.batchSize,
            sortable: true,
            sortField: "batchSize",
            minWidth: "50px",
        },

        {
            name: "Container Code",
            selector: (row) => row.containerCode,
            sortable: true,
            sortField: "containerCode",
            minWidth: "50px",
        },
        {
            name: "GW",
            selector: (row) => row.GW || "-",
            sortable: true,
            sortField: "GW",
            minWidth: "50px",
        },


        {
            name: "TW",
            selector: (row) => row.TW,
            sortable: true,
            sortField: "TW",
            minWidth: "50px",
        },
        {
            name: "NW",
            selector: (row) => row.NW,
            sortable: true,
            sortField: "NW",
            minWidth: "50px",
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

                            <div className="edit">
                                <button
                                    className="btn btn-sm btn-success edit-item-btn "
                                    data-bs-toggle="modal"
                                    disabled={loading2}
                                    data-bs-target="#showModal"
                                    onClick={() => handleDownload(row._id)}
                                >
                                    {!loading2 ? "Print" : "Printing.."}
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

    document.title = "QR  | BMS";

    return (
        <React.Fragment>
            <ToastContainer />
            <div className="page-content">
                <Container fluid>
                    <BreadCrumb maintitle="" title="QR " pageTitle="" />
                    <Row>
                        <Col lg={12}>
                            <Card>
                                <CardHeader>
                                    <FormsHeader
                                        formName="QR "
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
                    Add QR Code
                </ModalHeader>
                <form>
                    <ModalBody>

                        <Label>
                            Product Name <span className="text-danger">*</span>
                        </Label>
                        <div className="form-floating mb-3">
                            <select
                                name="productName"
                                className="p-2 h-100  form-control"
                                onChange={handleChange}
                            >
                                <option>Please Select</option>
                                {productData.map((c) => {
                                    return (
                                        <React.Fragment key={c._id}>
                                            {c.IsActive && (
                                                <option value={c._id}>{c.productName}</option>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </select>
                            {isSubmit && <p className="text-danger">{formErrors.productName}</p>}
                        </div>

                        <Label>
                            Brand Name
                        </Label>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                className="p-2 h-100  form-control"
                                name="brandName"
                                value={brandName}
                                onChange={handleChange}
                            />
                        </div>
                        <Label>
                            Licence No.
                        </Label>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                className="p-2 h-100  form-control"
                                name="licenceNo"
                                value={licenceNo}
                                onChange={handleChange}
                            />

                        </div>

                        <Label>
                            Name of API <span className="text-danger">*</span>
                        </Label>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"

                                className="p-2 h-100  form-control"
                                name="nameOfAPI"
                                value={nameOfAPI}
                                onChange={handleChange}
                            />
                            {isSubmit && <p className="text-danger">{formErrors.nameOfAPI}</p>}
                        </div>
                        <Label>
                            Container Code <span className="text-danger">*</span>
                        </Label>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"

                                className="p-2 h-100  form-control"
                                name="containerCode"
                                value={containerCode}
                                onChange={handleChange}
                            />
                            {isSubmit && <p className="text-danger">{formErrors.containerCode}</p>}
                        </div>
                        <Row>
                            <Col>
                                <Label>
                                    Batch No <span className="text-danger">*</span>
                                </Label>
                                <div className="form-floating mb-3">
                                    <Input
                                        type="text"

                                        className="p-2 h-100  form-control"
                                        name="batchNo"
                                        value={batchNo}
                                        onChange={handleChange}
                                    />
                                    {isSubmit && <p className="text-danger">{formErrors.batchNo}</p>}
                                </div>
                            </Col>
                            <Col>
                                <Label>
                                    Batch Size <span className="text-danger">*</span>
                                </Label>
                                <div className="form-floating mb-3">
                                    <Input
                                        type="text"

                                        className="p-2 h-100  form-control"
                                        name="batchSize"
                                        value={batchSize}
                                        onChange={handleChange}
                                    />
                                    {isSubmit && <p className="text-danger">{formErrors.batchSize}</p>}
                                </div>
                            </Col>
                        </Row>





                        <Row>
                            <Col>
                                <Label>
                                    Date of Manufacture (DOM) <span className="text-danger">*</span>
                                </Label>
                                <div className="form-floating mb-3">
                                    <Input
                                        type="date"

                                        className="p-2 h-100  form-control"
                                        name="DOM"
                                        value={DOM}
                                        onChange={handleChange}
                                    />
                                    {isSubmit && <p className="text-danger">{formErrors.DOM}</p>}
                                </div>
                            </Col>
                            <Col>
                                <Label>
                                    Date of Expiry (DOE) <span className="text-danger">*</span>
                                </Label>
                                <div className="form-floating mb-3">
                                    <Input
                                        type="date"

                                        className="p-2 h-100  form-control"
                                        name="DOE"
                                        value={DOE}
                                        onChange={handleChange}
                                    />
                                    {isSubmit && <p className="text-danger">{formErrors.DOE}</p>}
                                </div>
                            </Col>
                        </Row>









                        <Row>
                            <Col>
                                <Label>
                                    Gross Weight (GW) <span className="text-danger">*</span>
                                </Label>
                                <div className="form-floating mb-3">
                                    <Input
                                        type="text"

                                        className="p-2 h-100  form-control"
                                        name="GW"
                                        value={GW}
                                        onChange={handleChange}
                                    />
                                    {isSubmit && <p className="text-danger">{formErrors.GW}</p>}
                                </div>
                            </Col>
                            <Col>
                                <Label>
                                    Tare Weight (TW) <span className="text-danger">*</span>
                                </Label>
                                <div className="form-floating mb-3">
                                    <Input
                                        type="text"

                                        className="p-2 h-100  form-control"
                                        name="TW"
                                        value={TW}
                                        onChange={handleChange}
                                    />
                                    {isSubmit && <p className="text-danger">{formErrors.TW}</p>}
                                </div>
                            </Col>
                            <Col>
                                <Label>
                                    Net Weight (NW) <span className="text-danger">*</span>
                                </Label>
                                <div className="form-floating mb-3">
                                    <Input
                                        type="text"

                                        className="p-2 h-100  form-control"
                                        name="NW"
                                        value={NW}
                                        onChange={handleChange}
                                    />
                                    {isSubmit && <p className="text-danger">{formErrors.NW}</p>}
                                </div>
                            </Col>
                        </Row>

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
                    Edit QR Code
                </ModalHeader>
                <form>
                    <ModalBody>

                        <Label>
                            Product Name <span className="text-danger">*</span>
                        </Label>
                        <div className="form-floating mb-3">
                            <select
                                name="productName"
                                className="p-2 h-100  form-control"
                                onChange={handleChange}
                            >
                                {/* <option>Please Select</option> */}
                                {productData.map((c) => {
                                    return (
                                        <React.Fragment key={c._id}>
                                            {c.IsActive && (
                                                <option value={c._id}>{c.productName}</option>
                                            )}
                                        </React.Fragment>
                                    );
                                })}
                            </select>
                            {isSubmit && <p className="text-danger">{formErrors.productName}</p>}
                        </div>

                        <Label>
                            Brand Name <span className="text-danger">*</span>
                        </Label>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                className="p-2 h-100  form-control"
                                name="brandName"
                                value={brandName}
                                onChange={handleChange}
                            />
                            {isSubmit && <p className="text-danger">{formErrors.brandName}</p>}
                        </div>
                        <Label>
                            Licence No.
                        </Label>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"
                                className="p-2 h-100  form-control"
                                name="licenceNo"
                                value={licenceNo}
                                onChange={handleChange}
                            />

                        </div>

                        <Label>
                            Name of API <span className="text-danger">*</span>
                        </Label>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"

                                className="p-2 h-100  form-control"
                                name="nameOfAPI"
                                value={nameOfAPI}
                                onChange={handleChange}
                            />
                            {isSubmit && <p className="text-danger">{formErrors.nameOfAPI}</p>}
                        </div>
                        <Label>
                            Container Code <span className="text-danger">*</span>
                        </Label>
                        <div className="form-floating mb-3">
                            <Input
                                type="text"

                                className="p-2 h-100  form-control"
                                name="containerCode"
                                value={containerCode}
                                onChange={handleChange}
                            />
                            {isSubmit && <p className="text-danger">{formErrors.containerCode}</p>}
                        </div>
                        <Row>
                            <Col>
                                <Label>
                                    Batch No <span className="text-danger">*</span>
                                </Label>
                                <div className="form-floating mb-3">
                                    <Input
                                        type="text"

                                        className="p-2 h-100  form-control"
                                        name="batchNo"
                                        value={batchNo}
                                        onChange={handleChange}
                                    />
                                    {isSubmit && <p className="text-danger">{formErrors.batchNo}</p>}
                                </div>
                            </Col>
                            <Col>
                                <Label>
                                    Batch Size <span className="text-danger">*</span>
                                </Label>
                                <div className="form-floating mb-3">
                                    <Input
                                        type="text"

                                        className="p-2 h-100  form-control"
                                        name="batchSize"
                                        value={batchSize}
                                        onChange={handleChange}
                                    />
                                    {isSubmit && <p className="text-danger">{formErrors.batchSize}</p>}
                                </div>
                            </Col>
                        </Row>





                        <Row>
                            <Col>
                                <Label>
                                    Date of Manufacture (DOM) <span className="text-danger">*</span>
                                </Label>
                                <div className="form-floating mb-3">

                                    <Input
                                        type="date"

                                        className="p-2 h-100  form-control"
                                        name="DOM"
                                        value={DOM}
                                        onChange={handleChange}
                                    // min={moment().format("YYYY-MM-DD")}
                                    />
                                    {isSubmit && <p className="text-danger">{formErrors.DOM}</p>}
                                </div>
                            </Col>
                            <Col>
                                <Label>
                                    Date of Expiry (DOE) <span className="text-danger">*</span>
                                </Label>
                                <div className="form-floating mb-3">
                                    <Input
                                        type="date"

                                        className="p-2 h-100  form-control"
                                        name="DOE"
                                        value={DOE}
                                        onChange={handleChange}
                                    />
                                    {isSubmit && <p className="text-danger">{formErrors.DOE}</p>}
                                </div>
                            </Col>
                        </Row>
                        <Row>
                            <Col>
                                <Label>
                                    Gross Weight (GW) <span className="text-danger">*</span>
                                </Label>
                                <div className="form-floating mb-3">
                                    <Input
                                        type="text"

                                        className="p-2 h-100  form-control"
                                        name="GW"
                                        value={GW}
                                        onChange={handleChange}
                                    />
                                    {isSubmit && <p className="text-danger">{formErrors.GW}</p>}
                                </div>
                            </Col>
                            <Col>
                                <Label>
                                    Tare Weight (TW) <span className="text-danger">*</span>
                                </Label>
                                <div className="form-floating mb-3">
                                    <Input
                                        type="text"

                                        className="p-2 h-100  form-control"
                                        name="TW"
                                        value={TW}
                                        onChange={handleChange}
                                    />
                                    {isSubmit && <p className="text-danger">{formErrors.TW}</p>}
                                </div>
                            </Col>
                            <Col>
                                <Label>
                                    Net Weight (NW) <span className="text-danger">*</span>
                                </Label>
                                <div className="form-floating mb-3">
                                    <Input
                                        type="text"

                                        className="p-2 h-100  form-control"
                                        name="NW"
                                        value={NW}
                                        onChange={handleChange}
                                    />
                                    {isSubmit && <p className="text-danger">{formErrors.NW}</p>}
                                </div>
                            </Col>
                        </Row>

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

export default QRMaster;
