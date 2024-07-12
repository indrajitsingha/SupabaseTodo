import { useState, useEffect } from 'react';
import supabase from './utils/supabase';

function Page() {
    const [input, setInput] = useState("");
    const [edit, setEdit] = useState(null);
    const [todos, setTodos] = useState([]);
    const [image, setImage] = useState(null);

    async function getTodos() {
        const { data } = await supabase.from('todos').select()
        console.log(data);
        if (data?.length > 0) {
            setTodos(data);
        }
    }

    useEffect(() => {
        getTodos();
    }, []);

    const uploadImage = async (file) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        let { data, error } = await supabase.storage.from('avater').upload(filePath, file);
        console.log(data);
        if (error) {
            console.error('Error uploading image:', error);
            return null;
        }

        // const { publicURL, error: urlError } = supabase.storage.from('avater').getPublicUrl(filePath);
        // console.log(publicURL);
        // if (urlError) {
        //     console.error('Error getting public URL:', urlError);
        //     return null;
        // }

        return data?.fullPath;
    };

    const insertTodos = async () => {
        let imageUrl = null;

        if (image) {
            imageUrl = await uploadImage(image);
            console.log(imageUrl);
        }

        const { data, error } = await supabase.from("todos").insert({ todos: input, avater: "https://cwcxoefreqluglpiruut.supabase.co/storage/v1/object/public/"+imageUrl });
        console.log(data, error);
        await getTodos();
        setInput("");
        setImage(null);
    };

    const deleteTodos = async (id) => {
        const { data, error } = await supabase.from("todos").delete().eq("id", id);
        console.log(data, error);
        await getTodos();
    };

    const editTodos = async (todo) => {
        setInput(todo.todos);
        setEdit(todo);
    };

    const updateTodos = async () => {
        console.log(input, edit);
        let imageUrl = null;

        if (image) {
            imageUrl = await uploadImage(image);
        }

        const { data, error } = await supabase.from("todos").update({ todos: input, avater: "https://cwcxoefreqluglpiruut.supabase.co/storage/v1/object/public/"+imageUrl })
            .eq("id", edit.id);
        console.log(data, error);
        await getTodos();
        setInput("");
        setEdit(null);
        setImage(null);
    };

    return (
        <div>
            <input type='file' onChange={(e) => setImage(e.target.files[0])} />
            <input
                style={{ padding: "10px" }}
                type="text"
                onChange={(e) => setInput(e.target.value)}
                value={input}
            />
            <button onClick={edit ? updateTodos : insertTodos}>Submit</button>

            <table style={{ border: "2px solid white", marginTop: "10px" }}>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Todos</th>
                        <th>Avatar</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {todos.map((todo) => (
                        <tr key={todo.id}>
                            <td>{todo.id}</td>
                            <td>{todo.todos}</td>
                            <td><img src={todo.avater} alt="avatar" style={{ width: '50px' }} /></td>
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

export default Page;
