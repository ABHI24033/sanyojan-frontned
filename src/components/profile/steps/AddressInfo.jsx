import Input from "../../common/Input";
import SelectBox from "../../common/SelectBox";

const AccountInfo = ({ form, errors, handleChange, cities, states }) => {

  return (
    <fieldset className="wizard-fieldset show">
      <h6 className="text-md text-neutral-500">Communication & Address</h6>

      <div className="row gy-3">

        <Input
          name="phone"
          id="phone"
          label="Phone Number"
          placeholder="Phone Number"
          className="col-sm-4"
          value={form?.phone}
          onChange={handleChange}
          error={errors?.phone}
          required={true}
        />
        {/* WhatsApp Number */}
        <Input
          name="whatsappNo"
          id="whatsappNo"
          label="WhatsApp Number"
          placeholder="WhatsApp Number"
          className="col-sm-4"
          value={form?.whatsappNo}
          onChange={handleChange}
          error={errors?.whatsappNo}
          required={true}
        />

        {/* Email */}
        <Input
          name="email"
          id="email"
          label="Email"
          placeholder="Email"
          className="col-sm-4"
          value={form?.email}
          onChange={handleChange}
          error={errors?.email}
          required={true}
        />

      </div>

      <div className="row gy-3">

        {/* Address */}
        <Input
          name="address"
          id="address"
          label="Address"
          placeholder="Enter your local address"
          className="col-sm-4"
          value={form?.address}
          onChange={handleChange}
          error={errors?.address}
          required={true}
        />

        {/* Country */}
        <SelectBox
          name="country"
          id="country"
          label="Country"
          className="col-sm-4"
          value={form?.country}
          onChange={handleChange}
          error={errors?.country}
          options={[{ label: "India", value: "India" }]}
          required={true}
        />

        {/* State */}
        <SelectBox
          name="state"
          id="state"
          label="State"
          className="col-sm-4"
          value={form?.state}
          onChange={handleChange}
          error={errors?.state}
          options={[
            { label: "Select State", value: "" },
            ...states?.map((state) => ({
              label: state,
              value: state,
            })),
          ]}
          required={true}
        />

        {/* City */}
        <SelectBox
          name="city"
          id="city"
          label="City"
          className="col-sm-4"
          value={form?.city}
          onChange={handleChange}
          error={errors?.city}
          options={[
            { label: "Select City", value: "" },
            ...cities?.map((city) => ({
              label: city,
              value: city,
            })),
          ]}
          required={true}
        />

        {/* Postal Code */}
        <Input
          name="postalCode"
          id="postalCode"
          label="Postal Code"
          placeholder="Enter postal code"
          className="col-sm-4"
          value={form?.postalCode}
          onChange={handleChange}
          error={errors?.postalCode}
          required={true}
        />
      </div>
    </fieldset>
  );
};

export default AccountInfo;
