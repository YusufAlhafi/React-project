import * as React from "react";
import Container from "@mui/material/Container";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
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
import Todo from "./Todo";
import { Grid } from "@mui/material";

export default function TodoList() {
  const { todos, setTodos } = useContext(TodosContext);
  const { showHideToast } = useContext(ToastContext);
  const [dialogTodo, setDialogTodo] = useState(null); // Dialog içinde düzenlenen veya silinen todo
  const [showDeleteDialog, setShowDeleteDialog] = useState(false); // Silme dialog görünürlüğü
  const [showUpdateDialog, setShowUpdateDialog] = useState(false); // Güncelleme dialog görünürlüğü

  const [titleInput, setTitleInput] = useState(""); // Yeni görev başlığı inputu
  const [displayedTodosType, setDisplayedTodosType] = useState("all"); // Gösterilecek todo tipi (all, completed, non-completed)

  const [pendingToast, setPendingToast] = useState(""); // Dialog kapandıktan sonra gösterilecek toast mesajı

  // Tamamlanmış ve tamamlanmamış görevleri filtrelemek için
  const completedTodos = useMemo(
    () => todos.filter((t) => t.isCompleted),
    [todos]
  );
  const nonCompletedTodos = useMemo(
    () => todos.filter((t) => !t.isCompleted),
    [todos]
  );

  let todosToBeRendered = todos;
  if (displayedTodosType === "completed") todosToBeRendered = completedTodos;
  else if (displayedTodosType === "non-completed")
    todosToBeRendered = nonCompletedTodos;

  // Uygulama açıldığında localStorage'den görevleri yükle
  useEffect(() => {
    const StorageTodos = JSON.parse(localStorage.getItem("todos")) ?? [];
    setTodos(StorageTodos);
  }, []);

  // Dialog kapandıktan sonra pendingToast varsa göster
  useEffect(() => {
    if (!showUpdateDialog && pendingToast) {
      showHideToast(pendingToast);
      setPendingToast("");
    }
  }, [showUpdateDialog, pendingToast]);

  // Bu fonksiyon, gösterilecek todo tipini değiştirir
  function changeDisplayedType(e) {
    setDisplayedTodosType(e.target.value);
  }

  // Bu fonksiyon, yeni bir görev ekler ve localStorage'i günceller
  function handleAddClick() {
    if (!titleInput.trim()) return;
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

  // Bu fonksiyon, Enter tuşuna basıldığında yeni görev ekler
  function handleAddKeyDown(e) {
    if (e.key === "Enter") handleAddClick();
  }

  // Bu fonksiyon, seçilen görevi günceller ve Dialog'u kapatır
  function handleUpdateConfirm() {
    if (!dialogTodo.title.trim()) return;

    setShowUpdateDialog(false); // Dialog'u kapat

    const updatedTodos = todos.map((t) =>
      t.id === dialogTodo.id
        ? { ...t, title: dialogTodo.title, details: dialogTodo.details }
        : t
    );
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));

    setPendingToast("Güncellenmiş"); // Güncelleme sonrası toast göster
  }

  // Bu fonksiyon, Enter tuşuna basıldığında görevi güncelleme işlemini tetikler
  function handleUpdateKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleUpdateConfirm();
    }
  }

  // Bu fonksiyon, silme Dialog'unu açar
  function openDeleteDialog(todo) {
    setDialogTodo(todo);
    setShowDeleteDialog(true);
  }

  // Bu fonksiyon, silme Dialog'unu kapatır
  function handleDeleteDialogClose() {
    setShowDeleteDialog(false);
  }

  // Bu fonksiyon, seçilen görevi siler ve localStorage'i günceller
  function handleDeleteConfirm() {
    const updatedTodos = todos.filter((t) => t.id !== dialogTodo.id);
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    setShowDeleteDialog(false);

    setTimeout(() => showHideToast("Silinmiş"), 50); // Silme sonrası toast göster
  }

  // Bu fonksiyon, güncelleme Dialog'unu açar
  function openUpdateDialog(todo) {
    setDialogTodo(todo);
    setShowUpdateDialog(true);
  }

  // Bu fonksiyon, güncelleme Dialog'unu kapatır
  function handleUpdateClose() {
    setShowUpdateDialog(false);
  }

  // Render edilecek görevleri Todo component'leri olarak hazırla
  const todosJsx = todosToBeRendered.map((t) => (
    <Todo
      key={t.id}
      todo={t}
      showDelete={openDeleteDialog}
      showUpdate={openUpdateDialog}
    />
  ));

  return (
    <>
      {/* Silme Dialog */}
      <Dialog
        onClose={handleDeleteDialogClose}
        open={showDeleteDialog}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">
          Görevi silmek istediğinize emin misiniz?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
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

      {/* Güncelleme Dialog */}
      <Dialog
        onClose={handleUpdateClose}
        open={showUpdateDialog}
        aria-labelledby="alert-dialog-title"
      >
        <DialogTitle id="alert-dialog-title">Görevi Düzenle</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            required
            margin="dense"
            label="Görev Başliği"
            fullWidth
            variant="standard"
            value={dialogTodo?.title || ""}
            onChange={(e) =>
              setDialogTodo({ ...dialogTodo, title: e.target.value })
            }
            onKeyDown={handleUpdateKeyDown} // Enter ile güncelle
          />
          <TextField
            margin="dense"
            label="Detaylar"
            fullWidth
            variant="standard"
            value={dialogTodo?.details || ""}
            onChange={(e) =>
              setDialogTodo({ ...dialogTodo, details: e.target.value })
            }
            onKeyDown={handleUpdateKeyDown} // Enter ile güncelle
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose}>Kapat</Button>
          <Button onClick={handleUpdateConfirm} autoFocus>
            Güncelle
          </Button>
        </DialogActions>
      </Dialog>

      {/* Todo Listesi */}
      <Container maxWidth="sm">
        <Card sx={{ minWidth: 275, maxHeight: "80vh", overflow: "scroll" }}>
          <CardContent>
            <Typography variant="h2">Görevlerim</Typography>
            <Divider />

            {/* Filtre butonları */}
            <ToggleButtonGroup
              style={{ direction: "rtl", marginTop: "20px" }}
              value={displayedTodosType}
              exclusive
              onChange={changeDisplayedType}
            >
              <ToggleButton value="non-completed">Tamamlanmamiş</ToggleButton>
              <ToggleButton value="completed">Tamamlandi</ToggleButton>
              <ToggleButton value="all">Tümü</ToggleButton>
            </ToggleButtonGroup>

            {todosJsx}

            {/* Yeni görev ekleme */}
            <Grid container spacing={2} style={{ marginTop: "20px" }}>
              <Grid style={{ flex: 2 }}>
                <TextField
                  fullWidth
                  id="outlined-basic"
                  label="Görev Başliği"
                  variant="outlined"
                  value={titleInput}
                  onChange={(e) => setTitleInput(e.target.value)}
                  onKeyDown={handleAddKeyDown} // Enter ile ekleme
                />
              </Grid>
              <Grid style={{ flex: 1 }}>
                <Button
                  fullWidth
                  variant="contained"
                  onClick={handleAddClick}
                  disabled={titleInput.length === 0}
                >
                  Ekle
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </>
  );
}
