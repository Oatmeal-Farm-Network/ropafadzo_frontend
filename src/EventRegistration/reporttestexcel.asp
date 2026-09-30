<html>
<head>
<title>Create Excel Report</title>
<!--#Include file="GlobalVariables.asp"-->
</head>
<body>
<%

DIM fso, act, a
set fso = createobject("scripting.filesystemobject")
Set act = fso.CreateTextFile(server.mappath("/Uploads/"), true)

act.WriteLine("<html><body>")
act.WriteLine("<table border=""1"">")
act.WriteLine("<tr>")
act.WriteLine("<th nowrap>USER ID</th>")
act.WriteLine("<th nowrap>FIRST NAME</th>")
act.WriteLine("<th nowrap>LAST NAME</th>")
act.WriteLine("<th nowrap>EMAIL ADDRESS</th>")
act.WriteLine("</tr>")
for a = 0 to 5
	arr_exampleArray = Split(exampleArray(a),",")
	act.WriteLine("<tr>")
	act.WriteLine("<td align=""Left"" nowrap>" & arr_exampleArray(0) & "</td>" )
	act.WriteLine("<td align=""Left"" nowrap>" & arr_exampleArray(1) & "</td>" )
	act.WriteLine("<td align=""Left"" nowrap>" & arr_exampleArray(2) & "</td>" )
	act.WriteLine("<td align=""Left"" nowrap>" & arr_exampleArray(4) & "</td>" )
	act.WriteLine("</tr>")
next
act.WriteLine("</table></body></html>")
act.Close


if fso.FileExists(server.mappath(strPath)) Then
	Response.Write "Excel report has been created."
end if

set act = nothing
set fso = nothing
%>
</body>
</html>
