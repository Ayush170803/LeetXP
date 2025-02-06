document.addEventListener('DOMContentLoaded',function()
{
    const userinput = document.querySelector('#userinput');
    const searchbtn = document.querySelector('#searchbtn');
    const progress = document.querySelector('#progress');
    const circles = document.querySelector('.circles');
    const circleeach = document.querySelector('.circleeach');
    const easyproblem = document.querySelector('#easy-problem');
    const easydata = document.querySelector('#easydata');
    const mediumproblem = document.querySelector('#medium-problem');
    const mediumdata = document.querySelector('#mediumdata');
    const hardproblem = document.querySelector('#Hard-problem');
    const harddata = document.querySelector('#harddata');
    const stats = document.querySelector('#stats');

    function validate(username)
    {
        if(username.trim() === "")
        {
            alert("Please Enter Username Again");
            return false;
        }
        const regex = /^[a-zA-Z][a-zA-Z0-9_-]{3,14}$/;
        const match = regex.test(username);
        if(!match)
        {
            alert("Enter Valid Username");
        }
        return match;
    }


    function updatecircles(solved,total,label,circleeach)
    {
        const percentage =(solved/total)*100;
        circleeach.style.setProperty("--progresss",`${percentage}%`);
        label.textContent =`${solved}/${total}`;
    }

    function renderdata(output)
    {
        const totaleasyq=output?.data?.allQuestionsCount[1]?.count;
        const totalmediumq=output?.data?.allQuestionsCount[2]?.count;
        const totalhardq=output?.data?.allQuestionsCount[3]?.count;

        const easysolved=output?.data?.matchedUser?.submitStats?.acSubmissionNum[1]?.count;
        const mediumsolved=output?.data?.matchedUser?.submitStats?.acSubmissionNum[2]?.count;
        const hardsolved=output?.data?.matchedUser?.submitStats?.acSubmissionNum[3]?.count;

        updatecircles(easysolved,totaleasyq,easydata,easyproblem);
        updatecircles(mediumsolved,totalmediumq,mediumdata,mediumproblem);
        updatecircles(hardsolved,totalhardq,harddata,hardproblem);

        const acceptance=(output?.data?.matchedUser?.submitStats?.acSubmissionNum[0]?.submissions)/(output?.data?.matchedUser?.submitStats?.totalSubmissionNum[0]?.submissions)*100;
        const acceptanceRate = (acceptance).toFixed(2);
        const listdata=[
            {
                label:"Acceptance Rate", value:acceptanceRate
            }
        ];
        
        const badges=output?.data?.matchedUser?.badges || [];
        const annualBadges=badges.filter(badge => badge.name.trim().toLowerCase() === "annual badge");
        
        let badgeHTML=`<div class="badges-container">`;
        if (annualBadges.length > 0) {
            badgeHTML += annualBadges.map(badge =>
                `<div class="badge">
                    <img src="${badge.icon}" alt="${badge.name} Badge"/>
                    <p>${badge.name}</p>
                </div>`
            ).join('');
        } else {
            badgeHTML += `<p>No Annual Badges Available</p>`;
        }
        badgeHTML += `</div>`;

    badgeHTML+=`</div>`;
    const Ranking=(output?.data?.matchedUser?.profile?.ranking);
    const Rankdata=[
        {
            label:"Ranking", value:Ranking
        }
    ];
    
    const statsHTML = listdata.map(data =>
        `<div class="parent">
        <div class="card">
            <h3>${data.label}</h3>
            <h3>${data.value}</h3>
        </div>
        </div>`
    );
    const rankHTML = Rankdata.map(data =>
        `<div class="parent">
        <div class="card2">
            <h3>${data.label}</h3>
            <h3>${data.value}</h3>
        </div>
        </div>`
    );

    stats.innerHTML = badgeHTML + statsHTML + rankHTML;
    }

    async function userdatafetch(username)
    {
        try
        {
            const url='https://cors-anywhere.herokuapp.com/https://leetcode.com/graphql/';
            const myHeaders=new Headers();
            myHeaders.append("content-type","application/json");

            const graphql=JSON.stringify({
            query: `
                query userSessionProgress($username: String!) {
                allQuestionsCount {
                    difficulty
                    count
                }
               matchedUser(username: $username) {
        username
        profile {
          ranking
          reputation
        }
        badges {
          id
          name
          icon
        }
        languageProblemCount {
            languageName
            problemsSolved
         }
        submitStats {
          acSubmissionNum {
            difficulty
            count
            submissions
          }
          totalSubmissionNum {
            difficulty
            count
            submissions
          }
        }
      }
    }
            `,
            variables:{"username": `${username}` }
            });

            const requestOptions={
            method:"POST",
            headers:myHeaders,
            body:graphql,
            redirect:"follow"
            };

            const response=await fetch(url,requestOptions);
            if(!response.ok)
            {
                throw new console.error("unable to get details");
            }
            let output=await response.json();
            renderdata(output);
            console.log(output);
        }
        catch(error)
        {
            alert('No user found');
        }
    }

    searchbtn.addEventListener('click',function()
    {
        const username =userinput.value;
        console.log(username);
        if(validate(username))
        {
            userdatafetch(username);
        }
        
    })

})