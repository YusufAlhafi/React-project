import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import CheckIcon from "@mui/icons-material/Check";
import ModeEditOutlineOutlinedIcon from "@mui/icons-material/ModeEditOutlineOutlined";
import { useContext } from "react";
import { TodosContext } from "../contexts/todosContext";
import { ToastContext } from "../contexts/ToastContext";

export default function Todo({ todo, showDelete, showUpdate }) {
  const { todos, setTodos } = useContext(TodosContext); // Global todos ve güncelleme fonksiyonu
  const { showHideToast } = useContext(ToastContext); // Toast mesajını göstermek için

  // Bu fonksiyon, görevin tamamlanma durumunu değiştirir ve localStorage'i günceller
  function handleCheckClick() {
    const updatedTodos = todos.map((t) => {
      if (t.id == todo.id) {
        t.isCompleted = !t.isCompleted; // Görevin tamamlanmış/ tamamlanmamış durumunu değiştir
      }
      return t;
    });
    setTodos(updatedTodos);
    localStorage.setItem("todos", JSON.stringify(updatedTodos));
    showHideToast("Değiştirilmiş"); // Toast ile kullanıcıyı bilgilendir
  }

  // Bu fonksiyon, silme işlemi için üst bileşene todo bilgisini gönderir
  function handleDeleteClick() {
    showDelete(todo); // Silme dialogunu aç
  }

  // Bu fonksiyon, güncelleme işlemi için üst bileşene todo bilgisini gönderir
  function handleUpdateClick() {
    showUpdate(todo); // Güncelleme dialogunu aç
  }

  return (
    <>
      <Card
        className="todoCard"
        sx={{
          minWidth: 275,
          background: "#283598",
          color: "white",
          marginTop: 5,
          textAlign: "left",
        }}
      >
        <CardContent>
          <Grid container spacing={2}>
            {/* Görev başlığı ve detay */}
            <Grid size={8}>
              <Typography
                variant="h5"
                sx={{
                  textDecoration: todo.isCompleted ? "line-through" : "none", // Tamamlandıysa üstü çizili göster
                }}
              >
                {todo.title}
              </Typography>
              <Typography variant="h6">{todo.details}</Typography>
            </Grid>

            {/* İşlem butonları: Tamamla, Düzenle, Sil */}
            <Grid
              size={4}
              display="flex"
              justifyContent="space-around"
              alignItems="center"
              size="grow"
            >
              {/* Tamamla butonu */}
              <IconButton
                onClick={handleCheckClick}
                className="iconButton"
                aria-label="check"
                style={{
                  color: todo.isCompleted ? "white" : "#8bc34a",
                  background: todo.isCompleted ? "#8bc34a" : "white",
                  border: "solid #8bc34a 3px",
                }}
              >
                <CheckIcon />
              </IconButton>

              {/* Düzenle butonu */}
              <IconButton
                onClick={handleUpdateClick}
                className="iconButton"
                aria-label="edit"
                style={{
                  color: "#1769aa",
                  background: "white",
                  border: "solid #1769aa 3px",
                }}
              >
                <ModeEditOutlineOutlinedIcon />
              </IconButton>

              {/* Sil butonu */}
              <IconButton
                className="iconButton"
                aria-label="delete"
                style={{
                  color: "#b23c17",
                  background: "white",
                  border: "solid #b23c17 3px",
                }}
                onClick={handleDeleteClick}
              >
                <DeleteIcon />
              </IconButton>
            </Grid>
            {/* === İşlem butonları bitiş === */}
          </Grid>
        </CardContent>
      </Card>
    </>
  );
}
