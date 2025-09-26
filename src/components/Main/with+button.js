import React, { useState, useEffect } from "react";
import "./main.style.scss";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { ApiService } from "../../services/apiService";
import OrganisationUnitTree from "../OrganisationUnitTree";
import {
  setClickedOU,
  setOUList,
  setUserOU,
} from "../../store/outree/outree.action";
const Main = ({ data, head }) => {
  const dispatch = useDispatch();

  const [errors, setErrors] = useState({});

  const selectedOU = useSelector((state) => state.outree.clickedOU);
  const [loading, setLoading] = useState(false); //
  const [userRoles, setUserRoles] = useState([]); // ✅ store all role IDs
  const [selectedValue, setSelectedValue] = useState("");
   const [showForm, setShowForm] = useState(false); // ✅ control form visibility
  // Define buttons with unique IDs
  const buttons = [
    {
      id: "ZIyUEL6JOGj",
      role: "Regional Supervisors",
      label: "Create LGU MPMO",
    },
    {
      id: "U4PSYThC7BK",
      role: "LGU MPMO",
      label: "Create Barangay Supervisors",
    },
    { id: "RgsiAXF6U8e", role: "Superuser", label: "Create Data Collectors" },
  ];
  const [formData, setFormData] = useState({
    username: "", // prefilled example
    email: "",
    firstName: "",
    lastName: "",
    changePassword: true,
    password: "",
    repeatPassword: "",
    
  });
  //set the OrgUnits value in the store
  useEffect(() => {
    if (data) {
      if (data.ouList) dispatch(setOUList(data.ouList.organisationUnits));
      if (data.me) {
        if (data.me.organisationUnits.length >= 2)
          data.me.organisationUnits = data.me.organisationUnits.sort((a, b) =>
            a.name.localeCompare(b.name)
          );
        dispatch(setUserOU(data.me.organisationUnits));
        dispatch(setClickedOU(data.me.organisationUnits[0]));
      }
    }
  }, [data]);
  const getMe = async () => {
    try {
      const response = await ApiService.MeJson();
      console.log("RAW RESPONSE from ApiService:", response);

      // Case: if response is string
       const parsedData =
        typeof response === "string" ? JSON.parse(response) : response;

      if (parsedData.userRoles?.length > 0) {
        // store ALL role IDs
        const roleIds = parsedData.userRoles.map((r) => r.id);
        setUserRoles(roleIds);
      }
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  useEffect(() => {
    getMe();
  }, []);

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };
  // check validation
  const validate = () => {
    let newErrors = {};

    if (formData.changePassword) {
      if (!formData.password) {
        newErrors.password = "Please provide a value";
      } else if (
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.{8,})/.test(
          formData.password
        )
      ) {
        newErrors.password =
          "Password must be at least 8 characters with uppercase, lowercase, and a special character";
      }

      if (formData.repeatPassword !== formData.password) {
        newErrors.repeatPassword = "Passwords do not match";
      }
    }
    if (!formData.username) {
      newErrors.username = "Username is required";
    }
    // if (!formData.email) {
    //   newErrors.email = "Email is required";
    // }

    if (!formData.firstName) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName) {
      newErrors.lastName = "Last name is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleButtonClick = (btn) => {
    setSelectedValue(btn);
  };

  console.log("selected value", selectedValue);
  // handle submit with api post call
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Save button clicked ✅");

    if (validate()) {
      const payload = {
        // ...formData,
        firstName: formData.firstName,
        surname: formData.lastName,
        email: formData.email,
        username: formData.username,
        password: formData.password,
        organisationUnits: selectedOU ? [{ id: selectedOU.id }] : [],
        teiSearchOrganisationUnits: selectedOU ? [{ id: selectedOU.id }] : [],
        dataViewOrganisationUnits: selectedOU ? [{ id: selectedOU.id }] : [],
        userRoles: selectedValue ? [{ id: selectedValue.id }] : [],
        // userGroups: selectedValue ? [{ id: selectedValue.id }] : [],
      };

      console.log("Final Payload:", payload);

      try {
        setLoading(true); // 🔹 show loader before API call
        const response = await ApiService.createUser(payload);
        if (response.status === "OK") {
          alert("✅ User created successfully!");

          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            username: "",
            password: "",
          });
          setSelectedValue(null); // ✅ also clear the role selection
          setShowForm(false); // ✅ hide form after success
        } else if (response?.status === "ERROR") {
          // ✅ Only show backend message
          alert(`❌ ${response.message}`);
        }
      } catch (error) {
        console.error("❌ API call failed:", error);

        // ✅ Default fallback
        let errorMessage = "❌ Failed to create user. Please try again.";

        // Since createUser throws an Error with a clean message
        if (error?.message) {
          errorMessage = error.message;
        }

        alert(errorMessage);
      } finally {
        setLoading(false);
      }
    }
  };
// ✅ Filter buttons by userRoles
  const availableButtons = buttons.filter((btn) => userRoles.includes(btn.id));
  // console.log("ROLEEEE", role);
  return (
    <>
       <div className="container d-flex justify-content-center mt-4">
      <div
        className="w-100 p-4 border rounded"
        style={{ maxWidth: "900px", minHeight: "600px", overflowY: "auto" }}
      >
        {!showForm ? (
          // ✅ Only show this button at first
          <div className="text-center">
            <button
              className="btn btn-success px-4 py-2"
              onClick={() => setShowForm(true)}
            >
              ➕ Add User
            </button>
          </div>
        ) : (
          <div className="card shadow">
            <div className="card-body">
              <div className="d-flex justify-content-between align-items-center">
                <h2 className="mb-4">Add User</h2>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => setShowForm(false)}
                >
                  ✖ Close
                </button>
              </div>

              {/* <h2 className="mb-4">Add User</h2> */}
              <form onSubmit={handleSubmit}>
                {/* Username */}
                <h5 className="mb-3">Basic information</h5>

                {/* Username */}
                <div className="mb-3">
                  <label className="form-label">Username *</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.username ? "is-invalid" : ""
                    }`}
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                  />
                  {errors.username && (
                    <div className="invalid-feedback">{errors.username}</div>
                  )}
                </div>

                {/* Email */}
                <div className="mb-3">
                  <label className="form-label">Email address</label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">{errors.email}</div>
                  )}
                </div>

                {/* First Name */}
                <div className="mb-3">
                  <label className="form-label">First name *</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.firstName ? "is-invalid" : ""
                    }`}
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  {errors.firstName && (
                    <div className="invalid-feedback">{errors.firstName}</div>
                  )}
                </div>

                {/* Last Name */}
                <div className="mb-3">
                  <label className="form-label">Last name *</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.lastName ? "is-invalid" : ""
                    }`}
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  {errors.lastName && (
                    <div className="invalid-feedback">{errors.lastName}</div>
                  )}
                </div>

                <h5 className="mt-4 mb-3">Security</h5>

                <div className="form-check mb-3">
                  <input
                    type="checkbox"
                    className="form-check-input"
                    id="changePassword"
                    name="changePassword"
                    checked={formData.changePassword}
                    onChange={handleChange}
                  />
                  <label className="form-check-label" htmlFor="changePassword">
                    Create user password *
                  </label>
                </div>

                {formData.changePassword && (
                  <>
                    <div className="mb-3">
                      <label className="form-label">New password</label>
                      <input
                        type="password"
                        className={`form-control ${
                          errors.password ? "is-invalid" : ""
                        }`}
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                      />
                      <div className="form-text">
                        Password should be at least 8 characters long, with at
                        least one lowercase character, one uppercase character
                        and one special character.
                      </div>
                      {errors.password && (
                        <div className="invalid-feedback">
                          {errors.password}
                        </div>
                      )}
                    </div>

                    <div className="mb-3">
                      <label className="form-label">Confirm password</label>
                      <input
                        type="password"
                        className={`form-control ${
                          errors.repeatPassword ? "is-invalid" : ""
                        }`}
                        name="repeatPassword"
                        value={formData.repeatPassword}
                        onChange={handleChange}
                      />
                      {errors.repeatPassword && (
                        <div className="invalid-feedback">
                          {errors.repeatPassword}
                        </div>
                      )}
                    </div>
                  </>
                )}

                {/* <h5 className="mt-4 mb-3">UserRole</h5> */}
                <div className="d-flex gap-3 mb-3">
                {availableButtons.length > 0 ? (
                  availableButtons.map((btn) => (
                    <button
                      key={btn.id}
                      type="button"
                      className={`btn ${
                        selectedValue?.id === btn.id
                          ? "btn-primary"
                          : "btn-outline-primary"
                      }`}
                      onClick={() => handleButtonClick(btn)}
                    >
                      {btn.label}
                    </button>
                  ))
                ) : (
                  <p className="text-muted">No roles available for this user.</p>
                )}
              </div>

                {/* Selected Value */}
                <div className="mb-3">
                  <label className="form-label">UserRole</label>
                  <input
                    type="text"
                    value={selectedValue ? `${selectedValue.label}` : ""}
                    disabled
                    className="form-control mb-3"
                    placeholder=""
                  />
                </div>
                 {/* <div className="mb-3">
                  <label className="form-label">UserGroup</label>
                  <input
                    type="text"
                    value={selectedValue ? `${selectedValue.label}` : ""}
                    disabled
                    className="form-control mb-3"
                    placeholder=""
                  />
                </div> */}

                <h4 className="mt-4">Organisation unit access</h4>
                {selectedOU && (
                  <>
                    <div className="box p-3 d-flex">
                      <div>
                        <input
                          className="form-control"
                          id="organisation-unit"
                          disabled
                          value={selectedOU?.name}
                        />

                        <OrganisationUnitTree />
                      </div>
                    </div>
                  </>
                )}

                {/* Submit Button */}
                <div className="d-flex justify-content-center mt-4">
                  <button type="submit" className="btn btn-primary px-5">
                    {loading ? "Saving..." : "Save"}
                  </button>
                  {loading && <div className="loader">⏳ Please wait...</div>}
                </div>
              </form>
                
            </div>
          </div>
            )}
        </div>
      </div>
    </>
  );
};
export default Main;
