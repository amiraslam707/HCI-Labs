import tkinter as tk
import random
import time

# Lists of stimuli
letters = list("ABCDEFGHIJKLMNOPQRSTUVWXYZ")
numbers = list("0123456789")

class ReactionTimeApp:
    def __init__(self, root):
        self.root = root
        self.root.title("HCI Week 07 - Reaction Time Lab")
        self.root.geometry("800x500")  # Larger window
        self.root.configure(bg="navy")
        self.root.resizable(True, True)  # Allow manual resize if needed

        # Main stimulus label (big letter/number + feedback)
        self.label = tk.Label(
            root,
            text="Press SPACE to start",
            font=("Arial", 80, "bold"),
            bg="navy",
            fg="white",
            wraplength=700,  # Wrap long text
            justify="center"
        )
        self.label.pack(expand=True, fill="both", padx=20, pady=40)

        # Stats at bottom
        self.stats_label = tk.Label(
            root,
            text="Trials: 0 | Correct: 0 | Avg RT: N/A ms | Accuracy: N/A%",
            font=("Arial", 14),
            bg="navy",
            fg="yellow"
        )
        self.stats_label.pack(pady=10, fill="x")

        # Bind keys
        self.root.bind("<space>", self.start_or_reset)
        self.root.bind("<Key>", self.handle_key)

        self.state = "waiting"
        self.start_time = 0
        self.trials = 0
        self.correct = 0
        self.sum_rt = 0.0
        self.current_stimulus = ""
        self.expected_key = ""

    def start_or_reset(self, event):
        if self.state in ["waiting", "running"]:
            self.reset()
            self.start_experiment()

    def start_experiment(self):
        self.trials = 0
        self.correct = 0
        self.sum_rt = 0.0
        self.update_stats()
        self.show_ready()

    def show_ready(self):
        self.label.config(
            text="Get ready...\nFingers on A and L",
            font=("Arial", 50),
            fg="white"
        )
        delay = 1000 + random.randint(800, 3500)  # 1.8–4.5s random delay
        self.root.after(delay, self.show_stimulus)

    def show_stimulus(self):
        if random.random() < 0.5:
            self.current_stimulus = random.choice(letters)
            self.expected_key = "a"
        else:
            self.current_stimulus = random.choice(numbers)
            self.expected_key = "l"

        self.label.config(
            text=self.current_stimulus,
            font=("Arial", 120, "bold"),
            fg="yellow"
        )
        self.state = "running"
        self.start_time = time.time()

    def handle_key(self, event):
        if self.state != "running":
            return

        key = event.char.lower()
        end_time = time.time()
        rt = (end_time - self.start_time) * 1000  # ms

        self.trials += 1
        if key == self.expected_key:
            self.correct += 1
            self.sum_rt += rt
            feedback = f"Correct! RT: {rt:.0f} ms"
            color = "lime"
        else:
            feedback = f"Wrong! (expected {self.expected_key.upper()}) RT: {rt:.0f} ms"
            color = "red"

        self.label.config(
            text=f"{self.current_stimulus}\n{feedback}",
            font=("Arial", 60),
            fg=color,
            wraplength=700
        )
        self.update_stats()

        self.state = "waiting"
        self.root.after(1800, self.show_next_message)

    def show_next_message(self):
        self.label.config(
            text="Preparing next...",
            font=("Arial", 40),
            fg="white"
        )
        delay = 800 + random.randint(500, 1500)  # Shorter prep
        self.root.after(delay, self.show_stimulus)

    def update_stats(self):
        if self.trials > 0:
            avg_rt = self.sum_rt / self.trials
            acc = (self.correct / self.trials) * 100
            self.stats_label.config(
                text=f"Trials: {self.trials} | Correct: {self.correct} | Avg RT: {avg_rt:.0f} ms | Accuracy: {acc:.1f}%"
            )
        else:
            self.stats_label.config(text="Trials: 0 | Correct: 0 | Avg RT: N/A ms | Accuracy: N/A%")

    def reset(self):
        self.state = "waiting"
        self.label.config(
            text="Press SPACE to start / restart",
            font=("Arial", 50),
            fg="white"
        )
        self.update_stats()

if __name__ == "__main__":
    root = tk.Tk()
    app = ReactionTimeApp(root)
    root.mainloop()