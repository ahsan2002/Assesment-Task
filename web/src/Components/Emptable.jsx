import React, { useState,useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Button,Box,Modal ,Typography} from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from "axios";
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditIcon from '@mui/icons-material/Edit';


const Emptable = () => {
    const [open, setOpen] = useState(false);
    const [employees, setEmployees] = useState([]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [isEditMode, setIsEditMode] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)


  useEffect(() => {
    const getAllemployees = async () => {
        try {
          const response = await axios.get(`http://localhost:5001/employees`)
          console.log("response: ", response.data);
    
          setEmployees(response.data.data)
    
        } catch (error) {
          console.log("error in getting all employees", error);
        }
      }

      getAllemployees();
    
  }, [])
  

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 400,
        bgcolor: 'background.paper',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
      };


      const myFormik = useFormik({
        initialValues: {
          firstName: '',
          lastName: '',
          email: '',
          salary: '',
        },
        validationSchema:
          yup.object({
            firstName: yup
              .string('Enter your First name')
              .required('first name is required')
              .min(3, "please enter more then 3 characters ")
              .max(20, "please enter within 20 characters "),
    
              lastName: yup
              .string('Enter your Last Name')
              .required('last name is required')
              .min(3, "please enter more then 3 characters ")
              .max(20, "please enter within 20 characters "),

              email: yup
              .string('Enter your Email')
              .required('email is required'),
    
            salary: yup
              .number('Enter your salary')
              .required('salary is required'),
          }),
        onSubmit: (values,{resetForm}) => {
          console.log("values: ", values);
    
          axios.post(`http://localhost:5001/addemployee`, {
            firstName: values.firstName,
            lastName: values.lastName,
            email: values.email,
            salary: values.salary,
          })
            .then(response => {
              console.log("response: ", response.data);
              resetForm();
              setOpen(false)

    
            })
            .catch(err => {
              console.log("error: ", err);
            })
        },
      });
      const editFormik = useFormik({
        initialValues: {
          firstName: '',
          lastName: '',
          email: '',
          salary: '',
        },
        validationSchema:
          yup.object({
            firstName: yup
              .string('Enter your First name')
              .required('first name is required')
              .min(3, "please enter more then 3 characters ")
              .max(20, "please enter within 20 characters "),
    
              lastName: yup
              .string('Enter your Last Name')
              .required('last name is required')
              .min(3, "please enter more then 3 characters ")
              .max(20, "please enter within 20 characters "),

              email: yup
              .string('Enter your Email')
              .required('email is required'),
    
            salary: yup
              .number('Enter your salary')
              .required('salary is required'),
          }),
          onSubmit: (values,{resetForm}) => {
            console.log("values: ", values);
      
            axios.put(`http://localhost:5001/employee/${editingProduct.id}`, {
                firstName: values.firstName,
                lastName: values.lastName,
                email: values.email,
                salary: values.salary,
            })
              .then(response => {
                console.log("response: ", response.data);
                resetForm();
                setIsEditMode(false)
      
              })
              .catch(err => {
                console.log("error: ", err);
              })
          },
        });
      

      const editMode = (employee) => {
        setIsEditMode(!isEditMode)
        setEditingProduct(employee)
    
        editFormik.setFieldValue("firstName",employee.firstName)
        editFormik.setFieldValue("lastName", employee.lastName)
        editFormik.setFieldValue("salary", employee.salary)
        editFormik.setFieldValue("email", employee.email)
       
      }



    const columns = [
        { field: 'id', headerName:<b style={{fontWeight:'800'}}>ID</b> , width: 150 },
        { field: 'firstName', headerName: <b style={{fontWeight:'800'}}> First name</b>, width: 130 },
        { field: 'lastName', headerName: <b style={{fontWeight:'800'}}>Last name</b>, width: 130 },
        { field: 'email', headerName: <b style={{fontWeight:'800'}}>Email</b>, width: 250 },
        {
          field: 'salary',
          headerName:<b style={{fontWeight:'800'}}>Salary</b> ,
          type: 'number',
          width: 130,
          renderCell: (params) => {
      
            return (
                <p>{` $${params.row.salary}`}</p>
            );
          },
        },
        {
          field: 'date',
          headerName:<b style={{fontWeight:'800'}}>Date</b>,
          type: 'number',
          width: 200,
        },
        {
          field: 'action',
          headerName:<b style={{fontWeight:'800'}}>Actions</b>,
          width: 500,
          renderCell: (params) => {
            const handleEdit = () => {
                editMode(params.row)
            };
      
            const handleDelete = () => {

                const deleteProduct = async (id) => {
                    try {
                      const response = await axios.delete(`http://localhost:5001/employee/${id}`)
                      console.log("response: ", response.data);
                    } catch (error) {
                      console.log("error in deleting employee", error);
                    }
                  }
                  deleteProduct(params.row.id)
            };
      
            return (
                <div style={{display:'flex',gap:'10px'}}>
                <Button variant="contained" color="primary" onClick={handleEdit}>
                <EditIcon/>
                </Button>
                <Button variant="contained" color="warning" onClick={handleDelete}>
               <DeleteOutlineIcon/>
                </Button>
              </div>
            );
          },
        },
      ];

      
 

  return (
    <>
    <div>
    <div style={{margin:'20px'}}>
    <Button onClick={handleOpen} variant="contained">Add Employee</Button>
    </div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
        <h2>Employee Detail</h2>
        <form className='inputf' onSubmit={myFormik.handleSubmit}>
        <input
          id="firstName"
          placeholder="Enter Employee First Name"
          value={myFormik.values.firstName}
          onChange={myFormik.handleChange}
        />
        {
          (myFormik.touched.firstName && Boolean(myFormik.errors.firstName)) ?
            <span style={{ color: "red" }}>{myFormik.errors.firstName}</span>
            :
            null
        }

        <br />
        <input
          id="lastName"
          placeholder="Enter Employee Last Name"
          value={myFormik.values.lastName}
          onChange={myFormik.handleChange}
        />
        {
          (myFormik.touched.lastName && Boolean(myFormik.errors.lastName)) ?
            <span style={{ color: "red" }}>{myFormik.errors.lastName}</span>
            :
            null
        }

        <br />
        <input
          id="salary"
          placeholder="Enter Employee Salary"
          value={myFormik.values.salary}
          onChange={myFormik.handleChange}
          type='number'
        />
        {
          (myFormik.touched.salary && Boolean(myFormik.errors.salary)) ?
            <span style={{ color: "red" }}>{myFormik.errors.salary}</span>
            :
            null
        }
        <br />
        <input
          id="email"
          placeholder="Enter Employee Email"
          value={myFormik.values.email}
          onChange={myFormik.handleChange}
          type='email'
        />
        {
          (myFormik.touched.email && Boolean(myFormik.errors.email)) ?
            <span style={{ color: "red" }}>{myFormik.errors.email}</span>
            :
            null
        }

       
        <br />
        <div className="button">

        <button type="submit"> Submit </button>
        </div>
      </form>
          
        </Box>
      </Modal>
    </div>
    <br/>
    <br/>
        <div style={{ height: 500, width: '100%',textAlign:'center' }}>
      <DataGrid
        rows={employees}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </div>
    {
        employees.map((h)=>{
            return(

    (isEditMode && editingProduct.id === h.id) ?
        <form className='inputf' onSubmit={editFormik.handleSubmit}>
        <input
          id="firstName"
          placeholder="First Name"
          value={editFormik.values.firstName}
          onChange={editFormik.handleChange}
        />
        {
          (editFormik.touched.firstName && Boolean(editFormik.errors.firstName)) ?
            <span style={{ color: "red" }}>{editFormik.errors.firstName}</span>
            :
            null
        }

        <br />
        <input
          id="lastName"
          placeholder="Last Name"
          value={editFormik.values.lastName}
          onChange={editFormik.handleChange}
        />
        {
          (editFormik.touched.lastName && Boolean(editFormik.errors.lastName)) ?
            <span style={{ color: "red" }}>{editFormik.errors.lastName}</span>
            :
            null
        }

        <br />
        <input
          id="salary"
          placeholder="Salary"
          value={editFormik.values.salary}
          onChange={editFormik.handleChange}
          type='number'
        />
        {
          (editFormik.touched.salary && Boolean(editFormik.errors.salary)) ?
            <span style={{ color: "red" }}>{editFormik.errors.salary}</span>
            :
            null
        }
        <br />
        <input
          id="email"
          placeholder="Email"
          value={editFormik.values.email}
          onChange={editFormik.handleChange}
          type='email'
        />
        {
          (editFormik.touched.email && Boolean(editFormik.errors.email)) ?
            <span style={{ color: "red" }}>{editFormik.errors.email}</span>
            :
            null
        }

       
        <br />
        <div className="button">

        <button type="submit"> Submit </button>
        </div>
      </form> : null
            )

        })
    }

    </>
  )
}

export default Emptable