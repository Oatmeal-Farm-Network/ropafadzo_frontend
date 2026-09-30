<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
<link rel="stylesheet" type="text/css" href="style.css">
</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">


<!--#Include file="globalvariables.asp"--> 

<% ClassInfoID= Request.form("ClassInfoID") 
response.Write("ClassInfoID=" & ClassInfoID )
		If Len(ClassInfoID) < 1 then
			ClassInfoID= Request.querystring("ClassInfoID") 
		End If 

ReturnPage= Request.Form("ReturnPage") 
'rowcount = CInt
rowcount = 1

ImageName=Request.Form("ImageName") 
 rowcount =1


'Response.write("CaptionName=")
'Response.write(CaptionName)



Query =  " UPDATE ClassInfo Set " & ImageName & " = '0'  " 
Query =  Query & " where ClassInfoID= " & ClassInfoID & ";" 

response.write(Query)	


Conn.Execute(Query) 

	  rowcount= rowcount +1


	Conn.Close
	Set Conn = Nothing 
	if len(ReturnPage) > 1 then
	response.redirect(ReturnPage & "#" & ImageName )
	else
response.redirect("ClassesPhotos.asp?ClassInfoID=" & ClassInfoID & "&#ClassImage" & ImageID )
  end if
%>


 </Body>
</HTML>
