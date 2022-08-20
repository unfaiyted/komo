import React,{useState}  from "react";

const Setup = () => {
    // Will create a form for initial setup of application
    const [form, setForm] = useState<HTMLFormElement | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    // get number of monitors from komorebi


    const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    }


    // Form has inputs for selectin the number of workspaces
    // Form should be able to identify the number of monitors and ask about
    // each one and how many workstations
    return (
        <form onSubmit={handleFormSubmit}>
            <div className="form-group">
                <label htmlFor="number-of-workspaces">Default # of workspaces per monitor</label>
                <select id="number-of-workspaces">
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                </select>

                Enable Icons on Stacks



            </div>
        </form>




    )

}