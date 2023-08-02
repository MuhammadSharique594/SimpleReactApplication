import { useState, useContext, useEffect } from "react";

// import other component
import Titles from "../../Titles/Titles";
import FormInput from "../../Forms/FormInput/FormInput";
import { ApiContext } from "../../../Context/ApiContext";
import { TickCircle } from "iconsax-react";
import { getStorage } from '../../../utils/storage';

// import other pkg
import { Form, Button, Col, Spinner  } from "react-bootstrap";
import { useFormik } from "formik";
import { string, object, ref } from "yup";

const RequestApplication = ({ sidebarLinks, onChangeToggle, onChangeInfo }) => {
  const { GetApplication, applicationData, AddUpdateApplication } = useContext(ApiContext);
  const [submit, setSubmit] = useState(false);
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const [linksState, setLinks] = useState({
    links: [...sidebarLinks],
  });
  const [updateSubmitBtn, setUpdateSubmitBtn] = useState("");
  const [updateSubmitBtnTickMarkSize, setUpdateSubmitBtnTickMarkSize] = useState(0);

    useEffect(() => {

        GetApplication().then(() => {
            setIsLoading(false); // Set isLoading to false when API call is complete
          })
          .catch((error) => {
            console.error("Error fetching data:", error);
            setIsLoading(false); // Set isLoading to false even if API call fails
          });
    }, []);

    useEffect(() => {
        if (!isLoading && applicationData) {
          formik.setValues({
            subject: applicationData.subject || "",
            text: applicationData.text || "",
          });
          
          setUpdateSubmitBtn("Update");
        }
        else if(applicationData == undefined){
            formik.setValues({
                subject: "",
                text: "",
              });

              
            setUpdateSubmitBtn("Submit");
        }
        else{
            setUpdateSubmitBtn("Update");
        }
      }, [isLoading, applicationData]);

  const formik = useFormik({
    initialValues: {
      subject: "",
      text: "",
    },
    validationSchema: object({
      subject: string().required("Please enter your subject"),
      text: string().required("Please write your applicaiton in detail"),
    }),
    onSubmit: (values, { setFieldError }) => {
      console.log("values: ", values);
      if (values.subject === "") {
        setFieldError("subject", "Please enter your subjectsssssssssss");
      } 
      else if (values.text === "") {
        setFieldError("subject", "Please enter your subjectsssssssssssssssssssssssssssssssssss");
      }
      else {

        if(applicationData)
        {
            applicationData.subject = values.subject;
            applicationData.text = values.text;
    
            if(AddUpdateApplication(applicationData, false))
            {
                setUpdateSubmitBtn("Updated");
                setUpdateSubmitBtnTickMarkSize(20);
            }
        }
        else{
            var application = {
                subject: values.subject,
                text: values.text,
                createdBy: getStorage('users')[0].username
            }
    
            if(AddUpdateApplication(application, true))
            {
                setUpdateSubmitBtn("Submitted");
                setUpdateSubmitBtnTickMarkSize(20);
            }
        }
        
      }
    },
  });

  const backBtnClick = () => {
    linksState.links.forEach((link) => (link.active = false));

    const link = linksState.links.find((link) => link.id === 3);
    if (!link.href) {
      link.active = true;

      setLinks((prev) => {
        return {
          links: [...prev.links],
        };
      });

      onChangeToggle(link.text.toLowerCase());
    }
  }

  const print = () => {
    return applicationData ? <span>Update</span> : <span>Submit</span>
  }

  if (isLoading) {
    return (
        <div className="text-center mt-5">
          <Spinner animation="border" variant="primary" />
        </div>
      );
      
  }
  else{
    
    return (
        <>
          <Titles
            title="Welcome to create new Request Application"
            text="Create your new Request Application"
          />
    
          <Form className="mt-5" noValidate onSubmit={formik.handleSubmit}>
            <FormInput
              type="text"
              className="p-0"
              inpClass="px-3 py-2"
              name="subject"
              controlId="subject-input"
              text="Subjext"
              placeholder="Enter your Subject"
              valid={submit && !formik.errors.subject ? true : false}
              errMsg={formik.errors.subject || ""}
              invalid={submit && formik.errors.subject ? true : false}
              successMsg="done"
              {...formik.getFieldProps("subject")}
            />
            <Form.Group as={Col} xs={12} lg controlId="new-password-input">
              <Form.Label style={{ fontSize: "14px", marginTop: "20px" }}>
                Write your application
              </Form.Label>
              <Form.Control
                as="textarea" // Set the 'as' prop to 'textarea'
                className="p-0 mt-1 px-3 py-2"
                name="text"
                placeholder="Write your application here..."
                value={formik.values.text}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                isInvalid={submit && formik.errors.text}
                isValid={submit && !formik.errors.text && formik.values.text !== ""}
                rows="8"
              />
              {formik.touched.text && formik.errors.text && (
                <Form.Control.Feedback type="invalid">
                  {formik.errors.text}
                </Form.Control.Feedback>
              )}
              {submit && !formik.errors.text && formik.values.text !== "" && (
                <Form.Control.Feedback type="valid">done</Form.Control.Feedback>
              )}
            </Form.Group>
            <Button
              variant="primary"
              className="mt-5 py-2 px-4"
              type="button"
              onClick={() => backBtnClick()}
              Style="float:right;"
            >
              Back
            </Button>
            <Button
              variant="primary"
              disabled={submit && !formik.isValid ? true : false}
              className="mt-5 py-2 px-4"
              type="submit"
              onClick={() => setSubmit(true)}
              Style="margin-right:5px; float:right;"
            >
              <TickCircle
                          size={updateSubmitBtnTickMarkSize}
                          color="white"
                        />
              <span Style="margin-left: 2px;">
              {updateSubmitBtn}
              </span>
            </Button>
          </Form>
        </>
      );
  }

 
};

export default RequestApplication;
