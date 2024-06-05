import React, { useState } from "react";
import { Formik, Form, Field, FieldProps, FormikHelpers } from "formik";
import * as Yup from "yup";
import emailjs from "emailjs-com";

import {
  TextField,
  Button,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  Typography,
} from "@mui/material";

interface FormValues {
  name: string;
  email: string;
  attending: string;
  numPersons: number;
}

const RSVPForm: React.FC = () => {
  const [showPersonsDialog, setShowPersonsDialog] = useState(false);
  const [numPersons, setNumPersons] = useState(1);

  const initialValues: FormValues = {
    name: "",
    email: "",
    attending: "",
    numPersons: 1,
  };

  const validationSchema = Yup.object({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Email is required"),
    attending: Yup.string()
      .oneOf(["yes", "no"], "Invalid Selection")
      .required("Please select if you are attending"),
    numPersons: Yup.number().when("attending", {
      is: "yes",
      then: Yup.number()
        .min(1, "At least one person must attend")
        .required("Number of persons attending is required"),
    }),
  });

  const onSubmit = (values: any) => {
    emailjs
      .send("service_v7t59c7", "", values)
      .then((response) => {
        console.log("SUCCESS!", response.status, response.text);
        alert("Email sent successfully!");
      })
      .catch((err) => {
        console.error("FAILED...", err);
        alert("Failed to send email. Please try again later.");
      });
  };

  const handleAttendingChange = (
    event: React.ChangeEvent<{ value: unknown }>,
    setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void
  ) => {
    const attending = event.target.value as string;
    setFieldValue("attending", attending);
    if (attending === "yes") {
      setShowPersonsDialog(true);
    } else {
      setShowPersonsDialog(false);
      setFieldValue("numPersons", 1);
    }
  };

  const handleNumPersonsChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNumPersons(Number(event.target.value));
  };

  return (
    <div
      style={{
        backgroundImage: `url('/wedding-background.jpg')`,
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          color: "#fff",
          width: "600px",
        }}
      >
        <Typography fontSize={24} fontWeight={600} marginBottom={"1rem"}>
          RSVP Form
        </Typography>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={onSubmit}
        >
          {({ isSubmitting, setFieldValue, errors, touched }) => (
            <Form>
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Field name="name">
                    {({ field }: FieldProps) => (
                      <TextField
                        {...field}
                        label="Name"
                        variant="outlined"
                        fullWidth
                        error={touched.name && Boolean(errors.name)}
                        helperText={touched.name && errors.name}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <Field name="email">
                    {({ field }: FieldProps) => (
                      <TextField
                        {...field}
                        label="Email"
                        variant="outlined"
                        fullWidth
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                      />
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12} color={"#fff"}>
                  <Field name="attending">
                    {({ field }: FieldProps) => (
                      <TextField
                        {...field}
                        select
                        label="Are you attending?"
                        variant="outlined"
                        fullWidth
                        onChange={(e) =>
                          handleAttendingChange(e, setFieldValue)
                        }
                        error={touched.attending && Boolean(errors.attending)}
                        helperText={touched.attending && errors.attending}
                      >
                        <MenuItem value="">Select...</MenuItem>
                        <MenuItem value="yes">Yes</MenuItem>
                        <MenuItem value="no">No</MenuItem>
                      </TextField>
                    )}
                  </Field>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    disabled={isSubmitting}
                    fullWidth
                  >
                    Submit
                  </Button>
                </Grid>
              </Grid>

              <Dialog
                open={showPersonsDialog}
                onClose={() => setShowPersonsDialog(false)}
              >
                <DialogTitle>Number of Persons</DialogTitle>
                <DialogContent>
                  <DialogContentText>
                    Please enter the number of persons attending.
                  </DialogContentText>
                  <TextField
                    autoFocus
                    margin="dense"
                    id="numPersons"
                    label="Number of Persons"
                    type="number"
                    fullWidth
                    variant="outlined"
                    value={numPersons}
                    onChange={(e: any) => {
                      handleNumPersonsChange(e);
                      setFieldValue("numPersons", Number(e.target.value));
                    }}
                    error={Boolean(errors.numPersons)}
                    helperText={errors.numPersons}
                  />
                </DialogContent>
                <DialogActions>
                  <Button
                    onClick={() => setShowPersonsDialog(false)}
                    color="primary"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={() => setShowPersonsDialog(false)}
                    color="primary"
                  >
                    OK
                  </Button>
                </DialogActions>
              </Dialog>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default RSVPForm;
