document.addEventListener('DOMContentLoaded', function () {
    const userinput=document.querySelector('#userinput');
    const searchbtn=document.querySelector('#searchbtn');
    const easydata=document.querySelector('#easydata');
    const mediumdata=document.querySelector('#mediumdata');
    const harddata=document.querySelector('#harddata');
    const stats=document.querySelector('#stats');
    const backendURL = "https://leet-xp.vercel.app";

    function validate(username) {
        if (username.trim()==="")
        {
            alert("Please enter a username");
            return false;
        }
        const regex=/^[a-zA-Z][a-zA-Z0-9_-]{3,14}$/;
        if(!regex.test(username))
        {
            alert("Enter a valid LeetCode username");
            return false;
        }
        return true;
    }

    function updateCircle(solved,total,label,circleEl)
    {
        const percent=(solved/total)*100;
        circleEl.style.setProperty("--progresss",`${percent}%`);
        label.textContent=`${solved}/${total}`;
    }

    function renderData(data)
    {
        const allCounts=data?.data?.allQuestionsCount;
        const acCounts=data?.data?.matchedUser?.submitStats?.acSubmissionNum;

        const easyTotal=allCounts?.find(q => q.difficulty === "Easy")?.count || 0;
        const mediumTotal=allCounts?.find(q => q.difficulty === "Medium")?.count || 0;
        const hardTotal=allCounts?.find(q => q.difficulty === "Hard")?.count || 0;

        const easySolved=acCounts?.find(q => q.difficulty === "Easy")?.count || 0;
        const mediumSolved=acCounts?.find(q => q.difficulty === "Medium")?.count || 0;
        const hardSolved=acCounts?.find(q => q.difficulty === "Hard")?.count || 0;

        updateCircle(easySolved, easyTotal, easydata, document.querySelector("#easy-problem"));
        updateCircle(mediumSolved, mediumTotal, mediumdata, document.querySelector("#medium-problem"));
        updateCircle(hardSolved, hardTotal, harddata, document.querySelector("#Hard-problem"));

        const badgeSection=data.data.matchedUser.badges.map(badge => `
            <div class="badge">
                <img src="${badge.icon}" alt="${badge.name}" />
                <p>${badge.name}</p>
            </div>
        `).join('');

        const rank = data.data.matchedUser.profile.ranking;
        const reputation = data.data.matchedUser.profile.reputation;

        stats.innerHTML = `
            <div class="badges-container">${badgeSection}</div>
            <div class="stats-container">
                <div class="card">
                    <h3>Ranking</h3>
                    <h3>${rank}</h3>
                </div>
                <div class="card">
                    <h3>Reputation</h3>
                    <h3>${reputation}</h3>
                </div>
            </div>
        `;
    }

    async function fetchUserData(username) {
        try {
            const response=await fetch(`${backendURL}/leetcode`,{method:"POST",
                headers:{
                    "Content-Type":"application/json",
                },
                body:JSON.stringify({
                    query: `
                        query userSessionProgress($username: String!) {
                            allQuestionsCount {
                                difficulty
                                count
                            }
                            matchedUser(username: $username) {
                                profile {
                                    ranking
                                    reputation
                                }
                                badges {
                                    name
                                    icon
                                }
                                submitStats {
                                    acSubmissionNum {
                                        difficulty
                                        count
                                    }
                                }
                            }
                        }
                    `,
                    variables: {username: username}
                })
            });

            if(!response.ok) throw new Error("Failed to fetch data");
            const data=await response.json();
            if(!data.data||!data.data.matchedUser) throw new Error("User not found");
            renderData(data);

        } 
        catch(er)
        {
            alert("No user found");
            console.error(er);
        }
    }

    searchbtn.addEventListener('click',function () 
    {
        const username=userinput.value;
        if(validate(username)) 
        {
            fetchUserData(username);
        }
    });
});
