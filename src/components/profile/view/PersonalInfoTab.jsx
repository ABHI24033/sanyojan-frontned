import React from "react";
import { Icon } from "@iconify/react/dist/iconify.js";
import Input from "../../common/Input";
import SelectBox from "../../common/SelectBox";

const PersonalInfoTab = ({ formData, errors, handleChange, handleFileUpload, imagePreview, handleSubmit, isPending }) => {

    const getDefaultProfilePicture = () => {
        const gender = formData?.gender?.toLowerCase() || 'other';
        if (gender === 'male') {
            return "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
        } else if (gender === 'female') {
            return "https://cdn-icons-png.flaticon.com/512/3135/3135789.png";
        } else {
            return "https://cdn-icons-png.flaticon.com/512/3177/3177440.png";
        }
    };

    return (
        <div
            className='tab-pane fade show active'
            id='pills-edit-personal-info'
            role='tabpanel'
            aria-labelledby='pills-edit-profile-tab'
            tabIndex={0}
        >
            <h6 className='text-md text-primary-light mb-16'>Profile Image</h6>
            <div className='mb-24 mt-16'>
                <div className='avatar-upload'>
                    <div className='avatar-edit position-absolute bottom-0 end-0 me-24 mt-16 z-1 cursor-pointer'>
                        <input
                            type='file'
                            id='imageUpload'
                            accept='.png, .jpg, .jpeg'
                            hidden
                            onChange={handleFileUpload}
                        />
                        <label
                            htmlFor='imageUpload'
                            className='w-32-px h-32-px d-flex justify-content-center align-items-center bg-primary-50 text-primary-600 border border-primary-600 bg-hover-primary-100 text-lg rounded-circle'
                        >
                            <Icon icon='solar:camera-outline' className='icon' />
                        </label>
                    </div>
                    <div className='avatar-preview'>
                        <img
                            id='imagePreview'
                            src={imagePreview || getDefaultProfilePicture()}
                            alt="Profile"
                            style={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "50%" // Assuming avatar-preview is circular, ensuring img fits
                            }}
                        />
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit}>
                <div className="row gy-3">
                    <SelectBox
                        name="prefix"
                        id="prefix"
                        label="Prefix"
                        className="col-sm-4"
                        required
                        value={formData.prefix}
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

                    <Input
                        name="firstname"
                        id="firstname"
                        required
                        label="First Name"
                        placeholder="Enter First Name"
                        className="col-sm-4"
                        value={formData?.firstname}
                        onChange={handleChange}
                        error={errors.firstname}
                    />

                    <Input
                        name="lastname"
                        id="lastname"
                        required
                        label="Last Name"
                        placeholder="Enter Last Name"
                        className="col-sm-4"
                        value={formData?.lastname}
                        onChange={handleChange}
                        error={errors.lastname}
                    />

                    <SelectBox
                        name="gender"
                        id="gender"
                        label="Gender"
                        required
                        className="col-sm-4"
                        value={formData.gender}
                        onChange={handleChange}
                        error={errors.gender}
                        options={[
                            { label: "Male", value: "male" },
                            { label: "Female", value: "female" },
                            { label: "Other", value: "other" },
                        ]}
                    />

                    <Input
                        name="dob"
                        id="dob"
                        type="date"
                        required
                        label="Date of Birth"
                        className="col-sm-4"
                        value={formData.dob}
                        onChange={handleChange}
                        error={errors.dob}
                    />

                    <Input
                        name="age"
                        id="age"
                        label="Age"
                        className="col-sm-4"
                        value={formData.age}
                        disable={true}
                        placeholder="Calculated Age"
                        error={errors.age}
                    />

                    <Input
                        name="birthPlace"
                        id="birthPlace"
                        label="Birth Place"
                        className="col-sm-4"
                        value={formData.birthPlace}
                        onChange={handleChange}
                        placeholder="Enter Birth Place"
                        error={errors.birthPlace}
                    />

                    <SelectBox
                        name="marital_status"
                        id="marital_status"
                        label="Marital Status"
                        required
                        className="col-sm-4"
                        value={formData.marital_status}
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

                    <Input
                        name="marriageDate"
                        id="marriageDate"
                        type="date"
                        label="Marriage Date"
                        className="col-sm-4"
                        value={formData.marriageDate}
                        onChange={handleChange}
                        error={errors.marriageDate}
                    />
                </div>
                <div className='d-flex align-items-center justify-content-end gap-3 mt-24'>
                    <button
                        type='submit'
                        className='btn btn-primary border border-primary-600 text-md radius-8'
                        disabled={isPending}
                    >
                        {isPending ? "Updating..." : "Update"}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PersonalInfoTab;
