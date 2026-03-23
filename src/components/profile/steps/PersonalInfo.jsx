import Input from "../../common/Input";
import ProfileImageUpload from "../../common/ProfileUpload";
import SelectBox from "../../common/SelectBox";

const PersonalInfo = ({ form, errors, handleChange, handleFileUpload }) => {

  return (
    <fieldset className="wizard-fieldset show">

      {/* Profile Image */}
      <ProfileImageUpload
        value={form.profileImage}
        onFileSelect={(file) => handleFileUpload(file)}
        error={errors.profileImage}
      />
      <h6 className="text-md text-neutral-500">Personal Information</h6>
      <div className="row gy-3">

        {/* Prefix */}
        <SelectBox
          name="prefix"
          id="prefix"
          label="Prefix"
          className="col-sm-4"
          required={true}
          value={form.prefix}
          onChange={handleChange}
          error={errors.prefix}
          options={[
            { label: "Mr.", value: "Mr." },
            { label: "Mrs.", value: "Mrs." },
            { label: "Miss", value: "Miss" },
            { label: "Ms.", value: "Ms." },
            { label: "Dr.", value: "Dr." },
            { label: "Prof.", value: "Prof." },
            { label: "Rev.", value: "Rev." },
            { label: "Fr.", value: "Fr." },
            { label: "Sr.", value: "Sr." },
          ]}
        />

        {/* First Name */}
        <Input
          name="firstname"
          id="firstname"
          required={true}
          label="First Name"
          placeholder="Enter First Name"
          className="col-sm-4"
          value={form.firstname}
          onChange={handleChange}
          error={errors.firstname}
        />

        {/* Last Name */}
        <Input
          name="lastname"
          id="lastname"
          label="Last Name"
          placeholder="Enter Last Name"
          className="col-sm-4"
          value={form.lastname}
          onChange={handleChange}
          error={errors.lastname}
        />

        {/* Gender */}
        <SelectBox
          name="gender"
          id="gender"
          label="Gender"
          required={true}
          className="col-sm-4"
          value={form.gender}
          onChange={handleChange}
          error={errors.gender}
          options={[
            { label: "Male", value: "male" },
            { label: "Female", value: "female" },
            { label: "Other", value: "other" },
          ]}
        />

        {/* Date of Birth */}
        <Input
          name="dob"
          id="dob"
          type="date"
          required={true}
          label="Date of Birth"
          className="col-sm-4"
          value={form.dob}
          onChange={handleChange}
          error={errors.dob}
        />

        {/* Auto-calculated age */}
        <Input
          name="age"
          id="age"
          label="Age"
          className="col-sm-4"
          value={form.age}
          disable={true}
          placeholder="Calculated Age"
          error={errors.age}
        />

        {/* Date of Death */}


        {/* Birth Place */}
        <Input
          name="birthPlace"
          id="birthPlace"
          label="Birth Place"
          className="col-sm-4"
          value={form.birthPlace}
          onChange={handleChange}
          placeholder="Enter Birth Place"
          error={errors.birthPlace}
        />



        {/* Marital Status */}
        <SelectBox
          name="marital_status"
          id="marital_status"
          label="Marital Status"
          required={true}
          className="col-sm-4"
          value={form.marital_status}
          onChange={handleChange}
          error={errors.marital_status}
          options={[
            { label: "Single", value: "single" },
            { label: "Married", value: "married" },
            { label: "Divorced", value: "divorced" },
            { label: "Widowed", value: "widowed" },
            { label: "Separated", value: "separated" },
          ]}
        />

        {/* Marriage Date */}
        <Input
          name="marriageDate"
          id="marriageDate"
          type="date"
          label="Marriage Date"
          className="col-sm-4"
          value={form.marriageDate}
          onChange={handleChange}
          error={errors.marriageDate}
        />

      </div>
    </fieldset>
  );
};

export default PersonalInfo;
