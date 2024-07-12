import { useState, useEffect } from 'react';
import supabase from './utils/supabase';


const Addcar = () => {
    const [input, setInput] = useState({ carName: "", Price: "", Categories: "", Brand: "" });
    const [edit, setEdit] = useState(null);
    const [Cars, setCars] = useState([]);
    const [image, setImage] = useState(null);
    const [image2, setImage2] = useState(null);

    const HandleChnage = (e) => {
        setInput((val) => {
            return {
                ...val, [e.target.name]: e.target.value
            }
        })
    }

    async function getTodos() {

        const { data: Brands } = await supabase.from("Brands").select()

        const { data: Categories } = await supabase.from("Categories").select()



        const { data: CarDetails } = await supabase.from("CarDetails").select()
        // .eq("Brand","BMW").eq("Categories","hatchbacK")
        if (Brands?.length > 0 || CarDetails?.length > 0 || Categories.length > 0) {
            setCars({ Brands: Brands, Categories: Categories, CarDetails: CarDetails });
        }
        console.log(CarDetails);
    }

    useEffect(() => {
        getTodos();
    }, []);

    const uploadImage = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        let { data, error } = await supabase.storage.from("cars").upload(filePath, file);
        console.log(data);
        if (error) {
            console.error('Error uploading image:', error);
            return null;
        }

        // const { publicURL, error: urlError } = supabase.storage.from("brand").getPublicUrl(filePath);
        // console.log(publicURL);
        // if (urlError) {
        //     console.error('Error getting public URL:', urlError);
        //     return null;
        // }

        return data?.fullPath;
    };

    const insertTodos = async () => {
        let imageUrl = [];

        if (image) {
            let img=await uploadImage(image)
            imageUrl = [...imageUrl, "https://cwcxoefreqluglpiruut.supabase.co/storage/v1/object/public/" +img ];
        }
        if (image2) {
            let img=await uploadImage(image2)
            imageUrl = [...imageUrl, "https://cwcxoefreqluglpiruut.supabase.co/storage/v1/object/public/" + img];
        }
        console.log(input);
        const { data, error } = await supabase.from("CarDetails").insert({ ...input, carImg: imageUrl });
        console.log(data, error);
        await getTodos();
        setInput({});
        setImage(null);
    };

    const deleteTodos = async (id) => {
        const { data, error } = await supabase.from("CarDetails").delete().eq("id", id);
        console.log(data, error);
        await getTodos();
    };

    const editTodos = async (todo) => {
        setInput(todo.Brand);
        setEdit(todo);
    };

    const updateTodos = async () => {
        console.log(input, edit);
        let imageUrl = null;

        if (image) {
            imageUrl = await uploadImage(image);
        }

        const { data, error } = await supabase.from("CarDetails").update({ Brand: input, BrandLogo: "https://cwcxoefreqluglpiruut.supabase.co/storage/v1/object/public/" + imageUrl })
            .eq("id", edit.id);
        console.log(data, error);
        await getTodos();
        setInput({});
        setEdit(null);
        setImage(null);
    };

    return (
        <div>
            <div style={{ display: "flex", gap: "10px", flexDirection: "column" }}>
                <div style={{ display: "flex", gap: "10px", }}>
                    {/* <label >Car logo</label> */}
                    <input type='file' onChange={(e) => setImage(e.target.files[0])} />
                    <input type='file' onChange={(e) => setImage2(e.target.files[0])} />
                </div>

                <input
                    style={{ padding: "10px" }}
                    type="text"
                    onChange={HandleChnage}
                    value={input.carName}
                    name='carName'
                    placeholder='carName'
                />
                <input
                    style={{ padding: "10px" }}
                    type="text"
                    onChange={HandleChnage}
                    value={input.Price}
                    name='Price'
                    placeholder='Price'
                />
                <select name='Brand' value={input.Brand} style={{ padding: "10px" }} onChange={HandleChnage}>
                    {
                        Cars?.Brands?.map((value) => <option value={value.Brand} key={value.id}>{value.Brand}</option>)
                    }

                </select>
                <select name='Categories' value={input.Categories} style={{ padding: "10px" }} onChange={HandleChnage}>
                    {
                        Cars?.Categories?.map((value) => <option value={value.Categories} key={value.id}>{value.Categories}</option>)
                    }
                </select>
                <button onClick={edit ? updateTodos : insertTodos}>Submit</button>
            </div>

            <table style={{ border: "2px solid white", marginTop: "10px" }}>
                <thead>
                    <tr>
                        <th>Car Nmae</th>
                        <th>price</th>
                        <th>Brand</th>
                        <th>Category</th>
                        <th>Icon</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {Cars?.CarDetails?.map((cardet) => (
                        <tr key={cardet.id}>
                            <td>{cardet.carName}</td>
                            <td>{cardet.Price}</td>
                            <td>{cardet.Brand}</td>
                            <td>{cardet.Categories}</td>
                            <td>
                                {cardet?.carImg?.map((val) => <img key={val} src={val} alt="avatar" style={{ width: '50px' }} />)}
                            </td>
                            <td>
                                <button style={{ background: "#74E291" }} onClick={() => editTodos(todo)}>Edit</button>
                                <button style={{ background: "crimson" }} onClick={() => deleteTodos(todo.id)}>Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default Addcar