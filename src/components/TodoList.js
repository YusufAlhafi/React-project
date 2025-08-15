import * as React from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import FormatAlignLeftIcon from "@mui/icons-material/FormatAlignLeft";
import FormatAlignCenterIcon from "@mui/icons-material/FormatAlignCenter";
import FormatAlignRightIcon from "@mui/icons-material/FormatAlignRight";
import FormatAlignJustifyIcon from "@mui/icons-material/FormatAlignJustify";
import ToggleButton from "@mui/material/ToggleButton";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useState, useContext, useEffect, useMemo } from "react";
import { TodosContext } from "../contexts/todosContext";
import { ToastContext } from "../contexts/ToastContext";
import { v4 as uuidv4 } from "uuid";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

//components
import Todo from "./Todo";
import { Grid } from "@mui/material";
import { Title } from "@mui/icons-material";

export default function TodoList() {
  const { todos, setTodos } = useContext(TodosContext);
  const { showHideToast } = useContext(ToastContext);
  const [dialogTodo, setDialogTodo] = useState(null);
  const [showDeleteDialog, setShowDeleteDeialog] = useState(false);
  const [showUpdateDialog, setShowUpdateDeialog] = useState(false);

  const [titleInput, setTitleInput] = useState("");
  const [displayedTodosType, setDisplayedTodosType] = useState("all");

  const completedTodos = useMemo(() => {
    return todos.filter((t) => {
      return t.isCompleted;
    });
  }, [todos]);

  const nonCompletedTodos = useMemo(() => {
    return todos.filter((t) => {
      return !t.isCompleted;
    });
  }, [todos]);

  let todosToBeRendered = todos;
  if (displayedTodosType == "completed") {
    todosToBeRendered = completedTodos;
  } else if (displayedTodosType == "non-completed") {
    todosToBeRendered = nonCompletedTodos;
  } else {
    todosToBeRendered = todos;
  }

  useEffect(() => {
    const StorageTodos = JSON.parse(localStorage.getItem("todos")) ?? [];
    setTodos(StorageTodos);
  }, []);

  function changeDisplayedType(e) {
    setDisplayedTodosType(e.target.value);
  }

  function handleAddClick() {
    const newTodo = {
      id: uuidv4(),
      title: titleInput,
      details: "",
      isCompleted: false,
    };

    const updatedTodos = [...todos, newTodo];
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setTitleInput("");
    showHideToast("Yeni bir görev eklendi");
  }

  function openDeleteDeialog(todo) {
    setDialogTodo(todo);
    setShowDeleteDeialog(true);
  }

  function openUpdateDeialog(todo) {
    setDialogTodo(todo);
    setShowUpdateDeialog(true);
  }

  function handleDeleteDialogClose() {
    setShowDeleteDeialog(false);
  }

  function handleDeleteConfirm() {
    const updatedTodos = todos.filter((t) => {
      return t.id != dialogTodo.id;
    });
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setShowDeleteDeialog(false);
    showHideToast("Silinmiş");
  }

  function handleUpdateClose() {
    setShowUpdateDeialog(false);
  }

  function handleUpdateConfirm() {
    const updatedTodos = todos.map((t) => {
      if (t.id == dialogTodo.id) {
        return { ...t, title: dialogTodo.title, details: dialogTodo.details };
      } else {
        return t;
      }
    });
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setShowUpdateDeialog(false);
    showHideToast("Güncellenmiş");
  }

  const todosJsx = todosToBeRendered.map((t) => {
    return (
      <Todo
        key={t.id}
        todo={t}
        showDelete={openDeleteDeialog}
        showUpdate={openUpdateDeialog}
      />
    );
  });

  return (
    <>
      <Dialog
        style={{ direction: "rtl" }}
        onClose={handleDeleteDialogClose}
        open={showDeleteDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Görevi silmek istediğinize emin misiniz?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Silme işlemini geri alamazsiniz.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose}>Kapat</Button>
          <Button onClick={handleDeleteConfirm} autoFocus>
            Sil
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        style={{ direction: "ltr" }}
        onClose={handleUpdateClose}
        open={showUpdateDialog}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Görevi Düzenle</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Görev Başliği"
            fullWidth
            variant="standard"
            value={dialogTodo?.title || ""}
            onChange={(e) => {
              setDialogTodo({ ...dialogTodo, title: e.target.value });
            }}
          />
          <TextField
            autoFocus
            required
            margin="dense"
            id="name"
            name="email"
            label="Detaylar"
            fullWidth
            variant="standard"
            value={dialogTodo?.details || ""}
            onChange={(e) => {
              setDialogTodo({ ...dialogTodo, details: e.target.value });
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose}>Kapat</Button>
          <Button onClick={handleUpdateConfirm} autoFocus>
            Güncelle
          </Button>
        </DialogActions>
      </Dialog>

      <Container maxWidth="sm">
        <Card sx={{ minWidth: 275, maxHeight: "80vh", overflow: "scroll" }}>
          <CardContent>
            <Typography variant="h2">Görevlerim</Typography>
            <Divider />
            {/* Filter buttons */}
            <ToggleButtonGroup
              style={{ direction: "rtl", marginTop: "20px" }}
              value={displayedTodosType}
              exclusive
              onChange={changeDisplayedType}
              aria-label="text alignment"
            >
              <ToggleButton value="non-completed">Tamamlanmamiş</ToggleButton>
              <ToggleButton value="completed">Tamamlandi</ToggleButton>
              <ToggleButton value="all">Tümü</ToggleButton>
            </ToggleButtonGroup>

            {/* ==Filer buttons */}

            {/* All todos  */}
            {todosJsx}
            {/* ===All todos===  */}

            {/* input + add button */}
            <Grid container style={{ marginTop: "20px" }} spacing={2}>
              <Grid
                size={8}
                display="flex"
                justifyContent="space-around"
                alignItems="center"
              >
                <TextField
                  style={{ width: "100%" }}
                  id="outlined-basic"
                  label="Görev Başliği"
                  variant="outlined"
                  value={titleInput}
                  onChange={(e) => {
                    setTitleInput(e.target.value);
                  }}
                />
              </Grid>

              <Grid
                size={4}
                display="flex"
                justifyContent="space-around"
                alignItems="center"
              >
                <Button
                  style={{ width: "100%", height: "100%" }}
                  variant="contained"
                  onClick={() => {
                    handleAddClick();
                  }}
                  disabled={titleInput.length == 0}
                >
                  Ekle
                </Button>
              </Grid>
            </Grid>
            {/* ====input + add button====*/}
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
