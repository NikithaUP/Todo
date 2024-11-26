import { useEffect, useState } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    // const apiUrl = process.env.REACT_APP_BACKEND_URL || 'http://3.27.185.101:8000';
    const apiUrl = 'http://3.27.185.101:8000';

    console.log("API URL:", process.env.REACT_APP_BACKEND_URL);
    console.log("API URL:", apiUrl);


    const handleSubmit = () => {
    setError("");
    if (title.trim() !== '' && description.trim() !== '') {
        fetch(`${apiUrl}/todos`, {
            method: "POST",
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, description }),
        })
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Unable to create Todo item");
                }
                return res.json();
            })
            .then((newTodo) => {
                setTodos([...todos, newTodo]);
                setTitle("");
                setDescription("");
                setMessage("Item added successfully");
                setTimeout(() => setMessage(""), 3000);
            })
            .catch((error) => setError(error.message));
    } else {
        setError("Title and Description cannot be empty");
    }
};

    
    const getItems =() => {
         fetch(`${apiUrl}/todos`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("Failed to fetch todos");
                }
                return res.json();
            })
            .then((res) => setTodos(res))
            .catch((error) => {
                console.error("Error fetching todos:", error.message);
                setError("Failed to fetch todos");
            });
    };

    useEffect(() => {
        getItems();
    }, []);

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleUpdate = () => {
        setError("");
        if (editTitle.trim() !== '' && editDescription.trim() !== '') {
            fetch(`${apiUrl}/todos/${editId}`, {
                method: "PUT",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title: editTitle, description: editDescription }),
            })
                .then((res) => {
                    if (res.ok) {
                        return res.json();
                    }
                    throw new Error("Unable to update Todo item");
                })
                .then((updatedTodo) => {
                    const updatedTodos = todos.map((item) =>
                        item._id === editId ? updatedTodo : item
                    );
                    setTodos(updatedTodos);
                    setEditId(-1);
                    setMessage("Item updated successfully");
                    setTimeout(() => setMessage(""), 3000);
                })
                .catch((error) => setError(error.message));
        }
    };

    const handleEditCancel = () => setEditId(-1);

    const handleDelete = (id) => {
        if (window.confirm("Are you sure want to delete?")) {
            fetch(`${apiUrl}/todos/${id}`, { method: "DELETE" })
                .then((res) => {
                    if (!res.ok) {
                        throw new Error("Unable to delete Todo item");
                    }
                    const updatedTodos = todos.filter((item) => item._id !== id);
                    setTodos(updatedTodos);
                })
                .catch((error) => setError(error.message));
        }
    };

    return (
        <>
            <div className="row p-3 bg-success text-light my-3">
                <h1>ToDo Project with MERN stack</h1>
            </div>
            <div className="row">
                <h3>Add Item</h3>
                {message && <p className="text-success">{message}</p>}
                <div className="form-group d-flex gap-2">
                    <input
                        placeholder="Title"
                        onChange={(e) => setTitle(e.target.value)}
                        value={title}
                        className="form-control"
                        type="text"
                    />
                    <input
                        placeholder="Description"
                        onChange={(e) => setDescription(e.target.value)}
                        value={description}
                        className="form-control"
                        type="text"
                    />
                    <button className="btn btn-dark" onClick={handleSubmit}>
                        Submit
                    </button>
                </div>
                {error && <p className="text-danger">{error}</p>}
            </div>
            <div className="row mt-3">
                <h3>Tasks</h3>
                <div className="col-md-6">
                    <ul className="list-group">
                        {todos.map((item) => (
                            <li
                                key={item._id}
                                className="list-group-item bg-dark text-light d-flex justify-content-between align-items-center my-2"
                            >
                                <div className="d-flex flex-column me-2">
                                    {editId === -1 || editId !== item._id ? (
                                        <>
                                            <span className="fw-bold">{item.title}</span>
                                            <span>{item.description}</span>
                                        </>
                                    ) : (
                                        <>
                                            <div className="form-group d-flex gap-2">
                                                <input
                                                    placeholder="Title"
                                                    onChange={(e) =>
                                                        setEditTitle(e.target.value)
                                                    }
                                                    value={editTitle}
                                                    className="form-control"
                                                    type="text"
                                                />
                                                <input
                                                    placeholder="Description"
                                                    onChange={(e) =>
                                                        setEditDescription(e.target.value)
                                                    }
                                                    value={editDescription}
                                                    className="form-control"
                                                    type="text"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                                <div className="d-flex gap-2">
                                    {editId === -1 || editId !== item._id ? (
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => handleEdit(item)}
                                        >
                                            Edit
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-warning"
                                            onClick={handleUpdate}
                                        >
                                            Update
                                        </button>
                                    )}
                                    {editId === -1 || editId !== item._id ? (
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(item._id)}
                                        >
                                            Delete
                                        </button>
                                    ) : (
                                        <button
                                            className="btn btn-danger"
                                            onClick={handleEditCancel}
                                        >
                                            Cancel
                                        </button>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </>
    );
}
