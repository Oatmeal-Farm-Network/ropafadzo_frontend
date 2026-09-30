<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>

</head>
<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  >

<!--#Include file="globalvariables.asp"--> 

<%
ClassInfoID = request.form("ClassInfoID")
oldSpot = request.form("CurrentPhoto")
Newspot = request.form("PhotoOrder")
ReturnPage= request.form("ReturnPage")
dim ClassImagearray(12)
dim ClassImageCaptionArray(12)

			
sql = "select * from ClassInfo where ClassInfoID= " & ClassInfoID
'response.write(sql)
rs.Open sql, conn, 3, 3


If not rs.eof Then
	ClassImagearray(1) = rs("ClassImage1")
	ClassImagearray(2) = rs("ClassImage2")
	ClassImagearray(3) = rs("ClassImage3")
	ClassImagearray(4) = rs("ClassImage4")
	ClassImagearray(5) = rs("ClassImage5")
	ClassImagearray(6) = rs("ClassImage6")
	ClassImagearray(7) = rs("ClassImage7")
	ClassImagearray(8) = rs("ClassImage8")
	ClassImageCaptionArray(1) = rs("ClassImageCaption1")
	ClassImageCaptionArray(2) = rs("ClassImageCaption2")
	ClassImageCaptionArray(3) = rs("ClassImageCaption3")
	ClassImageCaptionArray(4) = rs("ClassImageCaption4")
	ClassImageCaptionArray(5) = rs("ClassImageCaption5")
	ClassImageCaptionArray(6) = rs("ClassImageCaption6")
	ClassImageCaptionArray(7) = rs("ClassImageCaption7")
	ClassImageCaptionArray(8) = rs("ClassImageCaption8")
end if


for x= 1 to 8
Dim str1
Dim str2
str1 = ClassImageCaptionArray(x)
str2 = "'"
If InStr(str1,str2) > 0 Then
	 ClassImageCaptionArray(x)= Replace(str1,  str2, "''")
End If  
next



CurrentClassImage = ClassImagearray(OldSpot)
CurrentClassImageCaption = ClassImageCaptionArray(OldSpot)


If OldSpot < Newspot then
   currentspot = 1  

For currentspot =  cint(OldSpot) to cint(Newspot -1 )
    response.write("currentspotx=" & currentspot & " <br>")
	 ClassImagearray(currentspot ) = ClassImagearray(currentspot + 1)
	 ClassImageCaptionArray(currentspot ) = ClassImagecaptionArray(currentspot + 1)
next


  currentspot = currentspot - 1

  ClassImagearray(Newspot) = CurrentClassImage
  ClassImageCaptionArray(Newspot) = CurrentClassImageCaption
end if 

response.write("Oldspot=" & Oldspot & " <br>")
response.write("Newspot=" & Newspot & " <br>")






If OldSpot > Newspot then
   currentspot = 0  
 
For currentspot =  cint(Oldspot) to cint(Newspot + 1) step -1
    response.write("currentspotx=" & currentspot & " <br>")
	 ClassImagearray(currentspot ) = ClassImagearray(currentspot - 1)
	 ClassImageCaptionArray(currentspot ) = ClassImagecaptionArray(currentspot - 1)
next
  
   

  ClassImagearray(Newspot) = CurrentClassImage
   ClassImageCaptionArray(Newspot) = CurrentClassImageCaption
end if 




If OldSpot = Newspot then
  DoNothing = true
else
	Query =  " UPDATE ClassInfo Set ClassImage1 = '" &  ClassImagearray(1) & "', " 
	Query =  Query & " ClassImageCaption1 = '"  & ClassImageCaptionArray(1) & "'," 
	Query =  Query & " ClassImage2 = '"  & ClassImagearray(2) & "'," 
	Query =  Query & " ClassImageCaption2 = '"  & ClassImageCaptionArray(2) & "'," 
	Query =  Query & " ClassImage3 = '"  & ClassImagearray(3) & "',"
	Query =  Query & " ClassImageCaption3 = '"  & ClassImageCaptionArray(3) & "'," 
	Query =  Query & " ClassImage4 = '"  & ClassImagearray(4) & "',"
	Query =  Query & " ClassImageCaption4 = '"  & ClassImageCaptionArray(4) & "'," 
	Query =  Query & " ClassImage5 = '"  & ClassImagearray(5) & "',"
	Query =  Query & " ClassImageCaption5 = '"  & ClassImageCaptionArray(5) & "'," 
	Query =  Query & " ClassImage6 = '"  & ClassImagearray(6) & "',"
	Query =  Query & " ClassImageCaption6 = '"  & ClassImageCaptionArray(6) & "'," 
	Query =  Query & " ClassImage7 = '"  & ClassImagearray(7) & "',"
	Query =  Query & " ClassImageCaption7 = '"  & ClassImageCaptionArray(7) & "'," 
	Query =  Query & " ClassImage8 = '"  & ClassImagearray(8) & "',"
	Query =  Query & " ClassImageCaption8 = '"  & ClassImageCaptionArray(8) & "'" 
	Query =  Query & " where ClassInfoID = " & ClassInfoID & ";" 

'response.write(Query)	


Conn.Execute(Query) 
end if 

	  rowcount= rowcount +1


Conn.Close
	Set Conn = Nothing 
	if len(ReturnPage) > 1 then
	response.redirect(ReturnPage)

	else
response.redirect("ClassesPhotos.asp?ClassInfoID=" & ClassInfoID & "&ClassImage=" & Newspot )
end if
%>


 </Body>
</HTML>
