import React from "react";
import Input from "../../common/Input";
import SelectBox from "../../common/SelectBox";

const AddressCommunicationTab = ({ formData, errors, handleChange, states, cities, handleSubmit, isPending }) => {
    return (
        <div
            className='tab-pane fade'
            id='pills-address-communication'
            role='tabpanel'
            aria-labelledby='pills-address-communication-tab'
            tabIndex='0'
        >
            <form onSubmit={handleSubmit}>
                <div className="row gy-3">
                    {/* <Input
                        name="phone"
                        id="phone"
                        label="Phone Number"
                        placeholder="Phone Number"
                        className="col-sm-4"
                        value={formData?.phone}
                        onChange={handleChange}
                        error={errors?.phone}
                        required={true}
                    /> */}

                    <Input
                        name="whatsappNo"
                        id="whatsappNo"
                        required={true}
                        label="WhatsApp Number"
                        placeholder="WhatsApp Number"
                        className="col-sm-4"
                        value={formData.whatsappNo}
                        onChange={handleChange}
                        error={errors.whatsappNo}
                    />

                    <Input
                        name="email"
                        id="email"
                        required={true}
                        label="Email"
                        placeholder="Email"
                        className="col-sm-4"
                        value={formData.email}
                        onChange={handleChange}
                        error={errors.email}
                    />
                </div>

                <div className="row gy-3 mt-1">
                    <Input
                        name="address"
                        id="address"
                        label="Address"
                        placeholder="Enter your local address"
                        className="col-sm-4"
                        value={formData.address}
                        onChange={handleChange}
                        error={errors.address}
                        required={true}
                    />

                    <SelectBox
                        name="country"
                        id="country"
                        required={true}
                        label="Country"
                        className="col-sm-4"
                        value={formData.country}
                        onChange={handleChange}
                        error={errors.country}
                        options={[{ label: "India", value: "India" }]}
                    />

                    <SelectBox
                        name="state"
                        id="state"
                        required={true}
                        label="State"
                        className="col-sm-4"
                        value={formData.state}
                        onChange={handleChange}
                        error={errors.state}
                        options={[
                            { label: "Select State", value: "" },
                            ...states.map((state) => ({
                                label: state,
                                value: state,
                            })),
                        ]}
                    />

                    <SelectBox
                        name="city"
                        id="city"
                        required={true}
                        label="City"
                        className="col-sm-4"
                        value={formData?.city}
                        onChange={handleChange}
                        error={errors.city}
                        options={[
                            ...cities.map((city) => ({
                                label: city,
                                value: city,
                            })),
                        ]}
                    />

                    <Input
                        name="postalCode"
                        id="postalCode"
                        required={true}
                        label="Postal Code"
                        placeholder="Enter postal code"
                        className="col-sm-4"
                        value={formData.postalCode}
                        onChange={handleChange}
                        error={errors.postalCode}
                    />
                </div>
                <div className='d-flex align-items-center justify-content-end mt-40 gap-3'>
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

export default AddressCommunicationTab;
