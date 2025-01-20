document.addEventListener('DOMContentLoaded', () => {
    const skillForm = document.getElementById('skill-form');
    const editSkillForm = document.getElementById('edit-skill-form');
    const progressForm = document.getElementById('progress-form');
    const skillsList = document.getElementById('skills-list');
    const skillSelect = document.getElementById('skill-select');
    const analyticsChart = document.getElementById('analytics-chart');
    const editSkillSection = document.getElementById('edit-skill-section');
  
    let skills = JSON.parse(localStorage.getItem('skills')) || [];
    let progress = JSON.parse(localStorage.getItem('progress')) || [];
    let chartInstance;
    let skillToEdit = null;
  
    const saveData = () => {
      localStorage.setItem('skills', JSON.stringify(skills));
      localStorage.setItem('progress', JSON.stringify(progress));
    };
  
    const renderSkills = () => {
      skillsList.innerHTML = '';
      skillSelect.innerHTML = '<option value="" disabled selected>Select a Skill</option>';
      skills.forEach((skill, index) => {
        const li = document.createElement('li');
        li.className = 'skill-item';
        li.innerHTML = `
          <span>${skill.name} - Goal: ${skill.goal}</span>
          <button class="edit-btn" data-index="${index}">Edit</button>
          <button class="delete-btn" data-index="${index}">Delete</button>
        `;
        skillsList.appendChild(li);
  
        const option = document.createElement('option');
        option.value = skill.name;
        option.textContent = skill.name;
        skillSelect.appendChild(option);
      });
      attachListeners();
    };
  
    const renderAnalytics = () => {
      const skillTime = {};
      progress.forEach(entry => {
        skillTime[entry.skill] = (skillTime[entry.skill] || 0) + entry.timeSpent;
      });
  
      const labels = Object.keys(skillTime);
      const data = Object.values(skillTime);
  
      
      const colors = labels.map(() => `#${Math.floor(Math.random() * 16777215).toString(16)}`);
  
      if (chartInstance) chartInstance.destroy();
  
      chartInstance = new Chart(analyticsChart, {
        type: 'bar',
        data: {
          labels,
          datasets: [
            {
              label: 'Time Spent (minutes)',
              data,
              backgroundColor: colors,
              borderColor: colors,
              borderWidth: 1,
            },
          ],
        },
        options: {
          responsive: true,
          plugins: {
            legend: { display: false },
          },
          scales: {
            y: {
              beginAtZero: true,
            },
          },
          barThickness: 15,
          maxBarThickness: 15,
        },
      });
    };
  
    skillForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const skillName = document.getElementById('skill-name').value;
      const goal = document.getElementById('goal').value;
      skills.push({ name: skillName, goal });
      saveData();
      renderSkills();
      skillForm.reset();
    });
  
    const attachListeners = () => {
      document.querySelectorAll('.edit-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
          const index = e.target.dataset.index;
          skillToEdit = index;
          document.getElementById('edit-skill-name').value = skills[index].name;
          document.getElementById('edit-goal').value = skills[index].goal;
          editSkillSection.style.display = 'block';
        });
      });
  
      document.querySelectorAll('.delete-btn').forEach((button) => {
        button.addEventListener('click', (e) => {
          const index = e.target.dataset.index;
          skills.splice(index, 1);
          saveData();
          renderSkills();
          renderAnalytics(); 
        });
      });
    };
  
    editSkillForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const updatedName = document.getElementById('edit-skill-name').value;
      const updatedGoal = document.getElementById('edit-goal').value;
      skills[skillToEdit] = { name: updatedName, goal: updatedGoal };
      saveData();
      renderSkills();
      editSkillSection.style.display = 'none';
    });
  
    progressForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const skill = skillSelect.value;
      const description = document.getElementById('progress-description').value;
      const timeSpent = parseInt(document.getElementById('time-spent').value, 10);
      progress.push({ skill, description, timeSpent, date: new Date().toLocaleDateString() });
      saveData();
      renderAnalytics();
      progressForm.reset();
    });
  
    renderSkills();
    renderAnalytics();
  });
  