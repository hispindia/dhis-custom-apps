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
  const [availableRoles, setAvailableRoles] = useState([]);
  const [assignedRoles, setAssignedRoles] = useState([]);
  const [selectedAvailable, setSelectedAvailable] = useState([]);
  const [selectedAssigned, setSelectedAssigned] = useState([]);
  const [filter, setFilter] = useState("");
  const [errors, setErrors] = useState({});
  const [availableGroups, setAvailableGroups] = useState([]);
  const [assignedGroups, setAssignedGroups] = useState([]);
  const [selectedAvailableGroups, setSelectedAvailableGroups] = useState([]);
  const [selectedAssignedGroups, setSelectedAssignedGroups] = useState([]);
  const [groupFilter, setGroupFilter] = useState("");
  const selectedOU = useSelector((state) => state.outree.clickedOU);
  const [loading, setLoading] = useState(false); //
  const [formData, setFormData] = useState({
    username: "", // prefilled example
    email: "",
    firstName: "",
    lastName: "",
    changePassword: false,
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
  //call getUserRole api and set data in setAvailableRoles
  const getUserRole = async () => {
    try {
      const response = await ApiService.getUserrole();
      // if ApiService already returns JSON, you don’t need JSON.parse
      let roles = response?.userRoles;
      // Case 2: response is string → parse it
      if (typeof response === "string") {
        const parsed = JSON.parse(response);
        roles = parsed?.userRoles;
      }
      setAvailableRoles(roles || []);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };
  // call getUserGroups api and set data in setAvailableGroups
  const getUserGroups = async () => {
    try {
      const response = await ApiService.getUserGroup();
      // if ApiService already returns JSON, you don’t need JSON.parse
      let groups = response?.userGroups;
      // Case 2: response is string → parse it
      if (typeof response === "string") {
        const parsed = JSON.parse(response);
        groups = parsed?.userGroups;
      }

      setAvailableGroups(groups || []);
    } catch (err) {
      console.error("Error fetching roles:", err);
    }
  };

  useEffect(() => {
    getUserRole();
    getUserGroups();
  }, [selectedOU]);

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

  // Move selected roles → Assigned
  const assignRoles = () => {
    const rolesToAssign = availableRoles.filter((r) =>
      selectedAvailable.includes(r.id)
    );
    setAssignedRoles([...assignedRoles, ...rolesToAssign]);
    setAvailableRoles(
      availableRoles.filter((r) => !selectedAvailable.includes(r.id))
    );
    setSelectedAvailable([]);
  };

  // Move selected roles → Available
  const unassignRoles = () => {
    const rolesToUnassign = assignedRoles.filter((r) =>
      selectedAssigned.includes(r.id)
    );
    setAvailableRoles([...availableRoles, ...rolesToUnassign]);
    setAssignedRoles(
      assignedRoles.filter((r) => !selectedAssigned.includes(r.id))
    );
    setSelectedAssigned([]);
  };

  // Filter available roles
  const filteredAvailable = availableRoles.filter((r) =>
    r.name.toLowerCase().includes(filter.toLowerCase())
  );
  //for userGroups

  // assign Groups to the user
  const assignGroups = () => {
    const groupsToAssign = availableGroups.filter((g) =>
      selectedAvailableGroups.includes(g.id)
    );
    setAssignedGroups([...assignedGroups, ...groupsToAssign]);
    setAvailableGroups(
      availableGroups.filter((g) => !selectedAvailableGroups.includes(g.id))
    );
    setSelectedAvailableGroups([]);
  };
  // unAssign Groups to the user
  const unassignGroups = () => {
    const groupsToUnassign = assignedGroups.filter((g) =>
      selectedAssignedGroups.includes(g.id)
    );
    setAvailableGroups([...availableGroups, ...groupsToUnassign]);
    setAssignedGroups(
      assignedGroups.filter((g) => !selectedAssignedGroups.includes(g.id))
    );
    setSelectedAssignedGroups([]);
  };
  const filteredAvailableGroups = availableGroups.filter((g) =>
    g.name.toLowerCase().includes(groupFilter.toLowerCase())
  );
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
        userRoles: assignedRoles.map((r) => ({ id: r.id })),
        userGroups: assignedGroups.map((g) => ({ id: g.id })),
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

          setAssignedRoles([]);
          setAssignedGroups([]);
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


  return (
    <>
      <div className="container d-flex justify-content-center mt-4">
        <div
          className="w-100 p-4 border rounded"
          style={{ maxWidth: "900px", minHeight: "600px", overflowY: "auto" }}
        >
          <div className="card shadow">
            <div className="card-body">
              <h2 className="mb-4">Add User</h2>
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
                    Create user password
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
                <h4 className="mt-4">Roles and groups</h4>
                <div className="row mt-4">
                  {/* Available Roles */}
                  <div className="col-md-5">
                    <h6>Available user roles</h6>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Filter options"
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                    />
                    <select
                      multiple
                      className="form-control"
                      size="10"
                      value={selectedAvailable}
                      onChange={(e) =>
                        setSelectedAvailable(
                          Array.from(
                            e.target.selectedOptions,
                            (opt) => opt.value
                          )
                        )
                      }
                    >
                      {filteredAvailable.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Buttons */}
                  <div className="col-md-2 d-flex flex-column align-items-center justify-content-center gap-2">
                    <button
                      onClick={assignRoles}
                      disabled={selectedAvailable.length === 0}
                      className="btn btn-primary mb-2"
                    >
                      →
                    </button>
                    <button
                      onClick={unassignRoles}
                      disabled={selectedAssigned.length === 0}
                      className="btn btn-primary"
                    >
                      ←
                    </button>
                  </div>

                  {/* Assigned Roles */}
                  <div className="col-md-5">
                    <h6>User roles this user is assigned *</h6>
                    <select
                      multiple
                      className="form-control"
                      size="10"
                      value={selectedAssigned}
                      onChange={(e) =>
                        setSelectedAssigned(
                          Array.from(
                            e.target.selectedOptions,
                            (opt) => opt.value
                          )
                        )
                      }
                    >
                      {assignedRoles.map((role) => (
                        <option key={role.id} value={role.id}>
                          {role.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* ---------------- GROUPS ---------------- */}
                <div className="row mt-5">
                  <div className="col-md-5">
                    <h6>Available user groups</h6>
                    <input
                      type="text"
                      className="form-control mb-2"
                      placeholder="Filter groups"
                      value={groupFilter}
                      onChange={(e) => setGroupFilter(e.target.value)}
                    />
                    <select
                      multiple
                      className="form-control"
                      size="10"
                      value={selectedAvailableGroups}
                      onChange={(e) =>
                        setSelectedAvailableGroups(
                          Array.from(
                            e.target.selectedOptions,
                            (opt) => opt.value
                          )
                        )
                      }
                    >
                      {filteredAvailableGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-2 d-flex flex-column align-items-center justify-content-center gap-2">
                    <button
                      type="button"
                      onClick={assignGroups}
                      disabled={selectedAvailableGroups.length === 0}
                      className="btn btn-primary mb-2"
                    >
                      →
                    </button>
                    <button
                      type="button"
                      onClick={unassignGroups}
                      disabled={selectedAssignedGroups.length === 0}
                      className="btn btn-primary"
                    >
                      ←
                    </button>
                  </div>

                  <div className="col-md-5">
                    <h6>User groups this user is assigned</h6>
                    <select
                      multiple
                      className="form-control"
                      size="10"
                      value={selectedAssignedGroups}
                      onChange={(e) =>
                        setSelectedAssignedGroups(
                          Array.from(
                            e.target.selectedOptions,
                            (opt) => opt.value
                          )
                        )
                      }
                    >
                      {assignedGroups.map((group) => (
                        <option key={group.id} value={group.id}>
                          {group.name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

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
        </div>
      </div>
    </>
  );
};
export default Main;
